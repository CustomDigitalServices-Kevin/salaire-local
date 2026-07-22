import { describe, expect, it } from "vitest";
import { computeMicro } from "./micro";
import { baremes } from "./baremes";

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

describe("computeMicro — ACRE première année", () => {
  it("réduit le taux de 50 % quand l'ACRE est activée", () => {
    const r = computeMicro({ caEncaisse: 50000, activite: "prestations_services_bic", acre: true });
    expect(r.taux).toBe(0.212 * baremes.micro.acre_reduction);
    expect(r.acreApplique).toBe(true);
    expect(r.cotisations).toBe(5300);
    expect(r.net).toBe(44700);
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
