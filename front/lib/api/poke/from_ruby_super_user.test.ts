import { Authenticator } from "@app/lib/auth";
import { describe, expect, it } from "vitest";

describe("Authenticator.fromRubySuperUser", () => {
  it("sets isRubySuperUser without a provisioned Ruby user", async () => {
    const auth = await Authenticator.fromRubySuperUser({
      pokePrincipal: { email: "seb@ruby.ad", name: "Seb" },
    });

    expect(auth.isRubySuperUser()).toBe(true);
    expect(auth.user()).toBeNull();
    expect(auth.getPokePrincipal()).toEqual({
      email: "seb@ruby.ad",
      name: "Seb",
    });
    expect(auth.toPokeUserJSON()).toMatchObject({
      email: "seb@ruby.ad",
      firstName: "Seb",
      fullName: "Seb",
    });
  });

  it("preserves poke identity when re-scoping", async () => {
    const auth = await Authenticator.fromRubySuperUser({
      pokePrincipal: { email: "seb@ruby.ad", name: null },
    });
    const scoped = await Authenticator.fromRubySuperUser({
      pokePrincipal: auth.getPokePrincipal(),
    });

    expect(scoped.isRubySuperUser()).toBe(true);
    expect(scoped.getPokePrincipal().email).toBe("seb@ruby.ad");
  });
});
