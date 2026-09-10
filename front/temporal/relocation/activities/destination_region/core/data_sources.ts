import config from "@app/lib/api/config";
import { getLlmCredentials } from "@app/lib/api/provider_credentials";
import { Authenticator } from "@app/lib/auth";
import { DataSourceModel } from "@app/lib/resources/storage/models/data_source";
import logger from "@app/logger/logger";
import type {
  CreateDataSourceProjectResult,
  DataSourceCoreIds,
} from "@app/temporal/relocation/activities/types";
import { CoreAPI } from "@app/types/core/core_api";
import type { CoreAPIDataSource } from "@app/types/core/data_source";
import type { RegionType } from "@app/types/region";

export async function createDataSourceProject({
  destRegion,
  sourceRegionCoreDataSource,
  workspaceId,
}: {
  destRegion: RegionType;
  sourceRegionCoreDataSource: CoreAPIDataSource;
  workspaceId: string;
}): Promise<CreateDataSourceProjectResult> {
  const localLogger = logger.child({
    destRegion,
    workspaceId,
  });

  localLogger.info("[Core] Creating data source project.");

  const auth = await Authenticator.internalAdminForWorkspace(workspaceId);
  const coreAPI = new CoreAPI(config.getCoreAPIConfig(), localLogger);
  const rubyProject = await coreAPI.createProject();
  if (rubyProject.isErr()) {
    localLogger.error(
      { error: rubyProject.error },
      "[Core] Failed to create internal project for the data source."
    );

    throw new Error("Failed to create internal project for the data source.");
  }

  const credentials = await getLlmCredentials(auth);

  const rubyDataSource = await coreAPI.createDataSource({
    projectId: rubyProject.value.project.project_id.toString(),
    config: sourceRegionCoreDataSource.config,
    credentials,
    // Temporary to unblock migration. Name was not returned by the core API.
    name: sourceRegionCoreDataSource.name ?? "",
  });

  if (rubyDataSource.isErr()) {
    localLogger.error(
      { error: rubyDataSource.error },
      "[Core] Failed to create the data source."
    );

    throw new Error("Failed to create the data source.");
  }

  localLogger.info("[Core] Created project and data source.");

  return {
    rubyAPIProjectId: rubyProject.value.project.project_id.toString(),
    rubyAPIDataSourceId: rubyDataSource.value.data_source.data_source_id,
  };
}

export async function updateDataSourceCoreIds({
  dataSourceCoreIds,
  destIds,
  workspaceId,
}: {
  dataSourceCoreIds: DataSourceCoreIds;
  destIds: CreateDataSourceProjectResult;
  workspaceId: string;
}) {
  const localLogger = logger.child({
    dataSourceCoreIds,
    workspaceId,
  });

  localLogger.info("[Core] Updating data source core ids");

  const dataSource = await DataSourceModel.findOne({
    where: {
      id: dataSourceCoreIds.id,
    },
  });

  if (!dataSource) {
    localLogger.error("[Core] Data source not found");
    throw new Error("Data source not found");
  }

  await dataSource.update({
    rubyAPIDataSourceId: destIds.rubyAPIDataSourceId,
    rubyAPIProjectId: destIds.rubyAPIProjectId,
  });

  localLogger.info("[Core] Updated data source core ids");
}
