import { describe, expect, it } from "vitest";
import { computePortage } from "./portage";

describe("computePortage — fourchette indicative", () => {
  it("estime le net central à 50 % du CA HT et encadre 45–55 %", () => {
    const r = computePortage({ caHT: 100000 });
    expect(r.netEstime).toBe(50000);
    expect(r.fourchetteBasse).toBe(45000);
    expect(r.fourchetteHaute).toBe(55000);
  });

  it("ordonne toujours basse <= central <= haute", () => {
    const r = computePortage({ caHT: 73450 });
    expect(r.fourchetteBasse).toBeLessThanOrEqual(r.netEstime);
    expect(r.netEstime).toBeLessThanOrEqual(r.fourchetteHaute);
  });

  it("gère un CA nul", () => {
    const r = computePortage({ caHT: 0 });
    expect(r.netEstime).toBe(0);
    expect(r.fourchetteBasse).toBe(0);
    expect(r.fourchetteHaute).toBe(0);
  });

  it("rejette un CA HT négatif", () => {
    expect(() => computePortage({ caHT: -1 })).toThrow(RangeError);
  });
});
