import { RootLayout } from "@ruby-ai/front/components/app/RootLayout";
import { ErrorBoundary } from "@ruby-ai/front/components/error_boundary/ErrorBoundary.js";
import { CellProvider } from "@ruby-ai/front/lib/auth/CellContext";
import { FetcherProvider } from "@ruby-ai/front/lib/swr/FetcherContext";
import { fetcher, fetcherWithBody } from "@ruby-ai/front/lib/swr/fetcher";
import { SparkleContext } from "@ruby-ai/sparkle";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";
import { AppReadyProvider } from "@spa/app/contexts/AppReadyContext";
import { ReactRouterLinkWrapper } from "@spa/lib/ReactRouterLinkWrapper";
import { routes } from "@spa/poke/routes";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes, {
  basename: import.meta.env?.VITE_BASE_PATH ?? "",
});

export default function PokeApp() {
  const sparkleContextValue = useMemo(
    () => ({ components: { link: ReactRouterLinkWrapper } }),
    []
  );

  return (
    <AppReadyProvider>
      <CellProvider>
        <FetcherProvider fetcher={fetcher} fetcherWithBody={fetcherWithBody}>
          <SparkleContext.Provider value={sparkleContextValue}>
            <RootLayout>
              <ErrorBoundary fallback={<GlobalErrorFallback />}>
                <RouterProvider router={router} />
              </ErrorBoundary>
            </RootLayout>
          </SparkleContext.Provider>
        </FetcherProvider>
      </CellProvider>
    </AppReadyProvider>
  );
}
