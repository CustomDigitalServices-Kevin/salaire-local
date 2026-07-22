import { describe, expect, it } from "vitest";
import { assertMontantPositif, assertTaux, round2 } from "./rounding";

describe("round2", () => {
  it("arrondit au centime, moitié à l'écart de zéro", () => {
    expect(round2(14.7375)).toBe(14.74);
    expect(round2(200.43)).toBe(200.43);
    expect(round2(2.005)).toBe(2.01);
    expect(round2(-2.005)).toBe(-2.01);
  });

  it("laisse un entier inchangé", () => {
    expect(round2(207)).toBe(207);
  });

  it("rejette les valeurs non finies", () => {
    expect(() => round2(Number.NaN)).toThrow(RangeError);
    expect(() => round2(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("assertMontantPositif", () => {
  it("accepte 0 et les positifs", () => {
    expect(() => {
      assertMontantPositif(0, "x");
      assertMontantPositif(42.5, "x");
    }).not.toThrow();
  });

  it("rejette négatif et NaN", () => {
    expect(() => {
      assertMontantPositif(-1, "x");
    }).toThrow(RangeError);
    expect(() => {
      assertMontantPositif(Number.NaN, "x");
    }).toThrow(RangeError);
  });
});

describe("assertTaux", () => {
  it("accepte les taux dans [0,1]", () => {
    expect(() => {
      assertTaux(0, "t");
      assertTaux(0.5, "t");
      assertTaux(1, "t");
    }).not.toThrow();
  });

  it("rejette les taux hors bornes", () => {
    expect(() => {
      assertTaux(-0.1, "t");
    }).toThrow(RangeError);
    expect(() => {
      assertTaux(1.1, "t");
    }).toThrow(RangeError);
  });
});
