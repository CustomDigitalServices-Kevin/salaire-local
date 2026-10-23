import { describe, expect, it } from "vitest";
import { computeMicro } from "./micro";

describe("computeMicro — cotisations forfaitaires par activité", () => {
  it("prestations de services BIC à 21,2 %", () => {
    const r = computeMicro({ caEncaisse: 50000, activite: "prestations_services_bic" });
    expect(r.tauxPlein).toBe(0.212);
    expect(r.taux).toBe(0.212);
    expect(r.cotisations).toBe(10600);
    expect(r.net).toBe(39400);
    expect(r.acreApplique).toBe(false);
    expect(r.aReverifier).toBe(false);
  });

  it("vente de marchandises BIC à 12,3 %", () => {
    const r = computeMicro({ caEncaisse: 80000, activite: "vente_marchandises_bic" });
    expect(r.cotisations).toBe(9840);
    expect(r.net).toBe(70160);
  });

  it("libéral général BNC à 25,6 % est marqué à revérifier", () => {
    const r = computeMicro({ caEncaisse: 30000, activite: "liberal_general_bnc" });
    expect(r.tauxPlein).toBe(0.256);
    expect(r.cotisations).toBe(7680);
    expect(r.aReverifier).toBe(true);
  });

  it("libéral CIPAV BNC à 23,2 %", () => {
    const r = computeMicro({ caEncaisse: 30000, activite: "liberal_cipav_bnc" });
    expect(r.tauxPlein).toBe(0.232);
    expect(r.cotisations).toBe(6960);
  });
});

describe("computeMicro - dated ACRE exemption", () => {
  it("charges 75% of the full rate for a creation or takeover on or after 2026-07-01", () => {
    const input = {
      caEncaisse: 50000,
      activite: "prestations_services_bic" as const,
      acre: true,
      periodeCreation: "a_partir_2026_07_01" as const,
    };
    const r = computeMicro(input);
    expect(r.taux).toBe(0.212 * 0.75);
    expect(r.acreApplique).toBe(true);
    expect(r.cotisations).toBe(7950);
    expect(r.net).toBe(42050);
  });

  it("charges 50% of the full rate for a creation or takeover before 2026-07-01", () => {
    const input = {
      caEncaisse: 50000,
      activite: "prestations_services_bic" as const,
      acre: true,
      periodeCreation: "avant_2026_07_01" as const,
    };
    const r = computeMicro(input);
    expect(r.taux).toBe(0.212 * 0.5);
    expect(r.acreApplique).toBe(true);
    expect(r.cotisations).toBe(5300);
    expect(r.net).toBe(44700);
  });

  it("defaults to the period on or after 2026-07-01", () => {
    const r = computeMicro({ caEncaisse: 50000, activite: "prestations_services_bic", acre: true });
    expect(r.taux).toBe(0.159);
    expect(r.cotisations).toBe(7950);
  });

  it.each([
    { activite: "vente_marchandises_bic", tauxPlein: 0.123 },
    { activite: "prestations_services_bic", tauxPlein: 0.212 },
    { activite: "liberal_general_bnc", tauxPlein: 0.256 },
    { activite: "liberal_cipav_bnc", tauxPlein: 0.232 },
  ] as const)("applies the selected exemption to $activite", ({ activite, tauxPlein }) => {
    const before = { caEncaisse: 10000, activite, acre: true, periodeCreation: "avant_2026_07_01" as const };
    const since = { ...before, periodeCreation: "a_partir_2026_07_01" as const };
    expect(computeMicro(before).taux).toBe(tauxPlein * 0.5);
    expect(computeMicro(since).taux).toBe(tauxPlein * 0.75);
    expect(computeMicro({ ...before, acre: false }).taux).toBe(tauxPlein);
    expect(computeMicro({ ...since, acre: false }).taux).toBe(tauxPlein);
  });

  it("keeps zero turnover at zero with ACRE enabled", () => {
    const r = computeMicro({ caEncaisse: 0, activite: "prestations_services_bic", acre: true });
    expect(r.cotisations).toBe(0);
    expect(r.net).toBe(0);
  });
});

describe("computeMicro — validation", () => {
  it("gère un CA nul", () => {
    const r = computeMicro({ caEncaisse: 0, activite: "vente_marchandises_bic" });
    expect(r.cotisations).toBe(0);
    expect(r.net).toBe(0);
  });

  it("rejette un CA négatif", () => {
    expect(() => computeMicro({ caEncaisse: -1, activite: "vente_marchandises_bic" })).toThrow(
      RangeError,
    );
  });
});
