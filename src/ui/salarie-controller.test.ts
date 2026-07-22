import { describe, expect, it } from "vitest";
import { computeSalarie } from "../lib";
import { resolveSalarie, type SalarieForm } from "./salarie-controller";

const base: SalarieForm = {
  direction: "brut",
  amount: 3000,
  cadre: false,
  alsaceMoselle: false,
  mutuellePatronale: null,
  tauxPAS: null,
};

describe("resolveSalarie", () => {
  it("computes net from gross for a non-cadre", () => {
    const result = resolveSalarie(base);
    expect(result.brut).toBe(3000);
    expect(result.netAPayer).toBeLessThan(3000);
    expect(result.netAPayer).toBeGreaterThan(2000);
    // No APEC line for a non-cadre.
    expect(result.cotisations.some((c) => c.key === "apec")).toBe(false);
  });

  it("adds the APEC line for a cadre", () => {
    const result = resolveSalarie({ ...base, cadre: true });
    expect(result.cotisations.some((c) => c.key === "apec")).toBe(true);
  });

  it("adds the Alsace-Moselle sickness line when enabled", () => {
    const result = resolveSalarie({ ...base, alsaceMoselle: true });
    expect(result.cotisations.some((c) => c.key === "maladie_alsace_moselle")).toBe(true);
  });

  it("inverts net à payer back to the originating gross", () => {
    const forward = computeSalarie({ brutMensuel: 3000, cadre: false });
    const result = resolveSalarie({ ...base, direction: "netAPayer", amount: forward.netAPayer });
    // Bisection converges to the cent.
    expect(Math.abs(result.brut - 3000)).toBeLessThan(0.02);
    expect(Math.abs(result.netAPayer - forward.netAPayer)).toBeLessThan(0.02);
  });

  it("inverts net imposable back to the originating gross", () => {
    const forward = computeSalarie({ brutMensuel: 3500, cadre: true });
    const result = resolveSalarie({
      ...base,
      cadre: true,
      direction: "netImposable",
      amount: forward.netImposable,
    });
    expect(Math.abs(result.brut - 3500)).toBeLessThan(0.02);
  });

  it("passes the withholding rate through so net after tax is computed", () => {
    const result = resolveSalarie({ ...base, tauxPAS: 0.1 });
    expect(result.impotPAS).not.toBeNull();
    expect(result.netApresImpot).not.toBeNull();
  });

  it("adds the employer mutuelle to the taxable net", () => {
    const withMutuelle = resolveSalarie({ ...base, mutuellePatronale: 30 });
    const without = resolveSalarie(base);
    expect(withMutuelle.netImposable - without.netImposable).toBeCloseTo(30, 2);
  });

  it("returns all zeros for a zero gross", () => {
    const result = resolveSalarie({ ...base, amount: 0 });
    expect(result.brut).toBe(0);
    expect(result.netAPayer).toBe(0);
    expect(result.totalCotisations).toBe(0);
  });
});
