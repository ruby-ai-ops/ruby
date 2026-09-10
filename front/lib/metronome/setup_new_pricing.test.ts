import { getNewPackages } from "@app/lib/metronome/setup_new_pricing";
import { describe, expect, it } from "vitest";

describe("credit-priced package definitions", () => {
  it("prices Business seats independently of Enterprise and preserves Partner Demo", () => {
    const packages = getNewPackages();
    const prices = Object.fromEntries(
      packages.map((pkg) => [
        pkg.name,
        Object.fromEntries(
          (pkg.overrides ?? [])
            .filter((override) => override.entitled)
            .map((override) => [override.product_name, override.price])
        ),
      ])
    );

    // USD uses cents; EUR and GBP use whole currency units in Metronome.
    expect(prices).toEqual({
      "Business USD": {
        "Pro Seat": 2_000,
        "Pro Seat (Yearly)": 19_200,
        "Max Seat": 4_000,
        "Max Seat (Yearly)": 38_400,
        "Free Seat": 0,
      },
      "Business EUR": {
        "Pro Seat": 20,
        "Pro Seat (Yearly)": 192,
        "Max Seat": 40,
        "Max Seat (Yearly)": 384,
        "Free Seat": 0,
      },
      "Business GBP": {
        "Pro Seat": 20,
        "Pro Seat (Yearly)": 192,
        "Max Seat": 40,
        "Max Seat (Yearly)": 384,
        "Free Seat": 0,
      },
      "Enterprise Pooled USD": { "Platform Seat (Yearly)": 24_000 },
      "Enterprise Pooled EUR": { "Platform Seat (Yearly)": 240 },
      "Enterprise Pooled USD (1st of month)": {
        "Platform Seat (Yearly)": 24_000,
      },
      "Enterprise Pooled EUR (1st of month)": {
        "Platform Seat (Yearly)": 240,
      },
      "Enterprise Seat-based USD": {
        "Pro Seat (Yearly)": 52_800,
        "Max Seat (Yearly)": 168_000,
        "Free Seat": 0,
      },
      "Enterprise Seat-based EUR": {
        "Pro Seat (Yearly)": 528,
        "Max Seat (Yearly)": 1_680,
        "Free Seat": 0,
      },
      "Partner Demo Enterprise USD": { "Platform Seat": 0 },
      "Partner Demo Enterprise EUR": { "Platform Seat": 0 },
    });

    for (const pkg of packages) {
      const seatCredits = (pkg.recurring_credits ?? []).filter(
        (credit) => credit.subscription_config?.allocation === "INDIVIDUAL"
      );
      if (pkg.name.startsWith("Partner Demo")) {
        expect(seatCredits, pkg.name).toEqual([]);
        expect(pkg.subscriptions, pkg.name).toEqual([
          expect.objectContaining({
            product_name: "Platform Seat",
            billing_frequency: "MONTHLY",
            quantity_management_mode: "QUANTITY_ONLY",
          }),
        ]);
        expect(pkg.recurring_credits, pkg.name).toHaveLength(1);
        expect(pkg.recurring_credits?.[0].access_amount, pkg.name).toEqual(
          expect.objectContaining({ unit_price: 5_000, quantity: 1 })
        );
      } else {
        expect(
          seatCredits.map((credit) => [
            credit.name,
            credit.access_amount.unit_price,
            credit.recurrence_frequency,
          ]),
          pkg.name
        ).toEqual([
          ["Pro Seat Credits", 500, "MONTHLY"],
          ["Pro Seat Credits", 500, "MONTHLY"],
          ["Max Seat Credits", 2_500, "MONTHLY"],
          ["Max Seat Credits", 2_500, "MONTHLY"],
        ]);
      }
    }
  });
});
