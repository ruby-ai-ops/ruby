import { upsertMetronomeAlert } from "@app/lib/metronome/alerts";
import { upsertPerUserCreditBalanceAlerts } from "@app/lib/metronome/alerts/per_user_credit_balance";
import { Ok } from "@app/types/shared/result";
import { expect, it, vi } from "vitest";

vi.mock("@app/lib/metronome/alerts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@app/lib/metronome/alerts")>()),
  upsertMetronomeAlert: vi.fn(),
}));

it("creates the Free low-balance alert at exactly 20 of 100 credits", async () => {
  vi.mocked(upsertMetronomeAlert).mockResolvedValue(
    new Ok({ alertId: "alert_test" })
  );

  const result = await upsertPerUserCreditBalanceAlerts({
    metronomeCustomerId: "customer_test",
    workspaceId: "workspace_test",
    userId: "user_test",
    allowanceAwu: 100,
  });

  expect(result.isOk()).toBe(true);
  expect(
    vi.mocked(upsertMetronomeAlert).mock.calls.map(([alert]) => ({
      threshold: alert.threshold,
      customerId: alert.customer_id,
      filters: alert.custom_field_filters,
    }))
  ).toEqual([
    {
      threshold: 0,
      customerId: "customer_test",
      filters: [
        {
          entity: "ContractCredit",
          key: "RUBY_PER_USER_CREDIT_USER",
          value: "user_test",
        },
      ],
    },
    {
      threshold: 20,
      customerId: "customer_test",
      filters: [
        {
          entity: "ContractCredit",
          key: "RUBY_PER_USER_CREDIT_USER",
          value: "user_test",
        },
      ],
    },
  ]);
});
