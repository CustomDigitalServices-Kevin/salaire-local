import { describe, expect, it } from "vitest";
import { bisect, brutFromNetAPayer, brutFromNetImposable } from "./inversion";
import { computeSalarie } from "./salarie";
import { round2 } from "./rounding";

describe("bisect - solveur générique monotone", () => {
  it("inverse une fonction affine croissante au centime", () => {
    const x = bisect(100, (v) => v * 0.8);
    expect(x).toBeCloseTo(125, 2);
  });

  it("retourne 0 pour une cible nulle", () => {
    expect(bisect(0, (v) => v)).toBe(0);
  });

  it("rejette une cible négative", () => {
    expect(() => bisect(-10, (v) => v)).toThrow(RangeError);
  });
});

describe("brutFromNetAPayer - round-trip brut→net→brut", () => {
  const contexts = [
    { label: "non-cadre", ctx: { cadre: false } as const },
    { label: "cadre", ctx: { cadre: true } as const },
    { label: "cadre Alsace-Moselle", ctx: { cadre: true, alsaceMoselle: true } as const },
  ];

  for (const { label, ctx } of contexts) {
    for (const brut of [1800, 3456.78, 6000, 12000]) {
      it(`retrouve le brut ${String(brut)} (${label}) au centime`, () => {
        const cible = computeSalarie({ ...ctx, brutMensuel: brut }).netAPayer;
        const retrouve = brutFromNetAPayer(cible, ctx);
        const verif = computeSalarie({ ...ctx, brutMensuel: retrouve }).netAPayer;
        // Both nets are cent-rounded, so their gap is a multiple of the cent;
        // "converge au centime" ⇒ at most one cent of ambiguity.
        expect(round2(Math.abs(verif - cible))).toBeLessThanOrEqual(0.01);
        expect(Math.abs(retrouve - brut)).toBeLessThanOrEqual(0.05);
      });
    }
  }

  it("rejette une cible négative", () => {
    expect(() => brutFromNetAPayer(-1, { cadre: false })).toThrow(RangeError);
  });
});

describe("brutFromNetImposable - round-trip sur le net imposable", () => {
  it("retrouve un brut dont le net imposable correspond", () => {
    const ctx = { cadre: true } as const;
    const cible = computeSalarie({ ...ctx, brutMensuel: 4200 }).netImposable;
    const retrouve = brutFromNetImposable(cible, ctx);
    const verif = computeSalarie({ ...ctx, brutMensuel: retrouve }).netImposable;
    expect(round2(Math.abs(verif - cible))).toBeLessThanOrEqual(0.01);
    expect(retrouve).toBeCloseTo(4200, 1);
  });
});
