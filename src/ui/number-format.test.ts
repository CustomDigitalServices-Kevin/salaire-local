import { describe, expect, it } from "vitest";
import {
  formatEuros,
  formatIsoDate,
  formatPercent,
  parseAmount,
  parsePercent,
} from "./number-format";

// Normalises non-breaking / narrow-no-break spaces the Intl French formatter
// inserts, so assertions read against plain ASCII.
function plain(value: string): string {
  return value.replace(/\s/g, " ");
}

describe("formatEuros", () => {
  it("formats French amounts with a euro suffix and two decimals", () => {
    expect(plain(formatEuros(3000, "fr"))).toBe("3 000,00 €");
  });

  it("formats English amounts with a euro prefix", () => {
    expect(plain(formatEuros(3000, "en"))).toBe("€3,000.00");
  });

  it("rounds display to two decimals", () => {
    expect(plain(formatEuros(2345.6, "fr"))).toBe("2 345,60 €");
  });
});

describe("formatPercent", () => {
  it("renders a whole percentage", () => {
    expect(plain(formatPercent(0.069, "fr"))).toBe("6,9 %");
  });

  it("keeps sub-percent precision for small rates", () => {
    expect(plain(formatPercent(0.00024, "en"))).toBe("0.024%");
  });

  it("formats an aggregate rate", () => {
    expect(plain(formatPercent(0.22, "en"))).toBe("22%");
  });
});

describe("formatIsoDate", () => {
  it("formats an ISO date in long French form", () => {
    expect(formatIsoDate("2026-07-22", "fr")).toBe("22 juillet 2026");
  });

  it("formats an ISO date in long English form", () => {
    expect(formatIsoDate("2026-07-22", "en")).toBe("July 22, 2026");
  });

  it("returns the raw string when the input is malformed", () => {
    expect(formatIsoDate("not-a-date", "fr")).toBe("not-a-date");
  });
});

describe("parseAmount", () => {
  it("parses a plain integer", () => {
    expect(parseAmount("3000")).toEqual({ ok: true, value: 3000 });
  });

  it("parses a French amount with space thousands and comma decimals", () => {
    expect(parseAmount("3 500,50")).toEqual({ ok: true, value: 3500.5 });
  });

  it("parses a French amount with a non-breaking space", () => {
    expect(parseAmount("3 500,50")).toEqual({ ok: true, value: 3500.5 });
  });

  it("parses an English amount with comma thousands and dot decimals", () => {
    expect(parseAmount("3,500.50")).toEqual({ ok: true, value: 3500.5 });
  });

  it("treats a lone comma as a decimal separator", () => {
    expect(parseAmount("1234,5")).toEqual({ ok: true, value: 1234.5 });
  });

  it("flags an empty string", () => {
    expect(parseAmount("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it("flags a non-numeric string", () => {
    expect(parseAmount("abc")).toEqual({ ok: false, reason: "invalid" });
  });

  it("flags a partially non-numeric string", () => {
    expect(parseAmount("3000abc")).toEqual({ ok: false, reason: "invalid" });
  });

  it("flags a negative amount", () => {
    expect(parseAmount("-100")).toEqual({ ok: false, reason: "negative" });
  });

  it("accepts zero", () => {
    expect(parseAmount("0")).toEqual({ ok: true, value: 0 });
  });
});

describe("parsePercent", () => {
  it("parses a percentage into a decimal rate", () => {
    expect(parsePercent("12,5")).toEqual({ ok: true, value: 0.125 });
  });

  it("strips a trailing percent sign", () => {
    expect(parsePercent("3%")).toEqual({ ok: true, value: 0.03 });
  });

  it("accepts the bounds 0 and 100", () => {
    expect(parsePercent("0")).toEqual({ ok: true, value: 0 });
    expect(parsePercent("100")).toEqual({ ok: true, value: 1 });
  });

  it("flags an empty string", () => {
    expect(parsePercent("")).toEqual({ ok: false, reason: "empty" });
  });

  it("flags a non-numeric string", () => {
    expect(parsePercent("xx")).toEqual({ ok: false, reason: "invalid" });
  });

  it("flags a rate above 100", () => {
    expect(parsePercent("150")).toEqual({ ok: false, reason: "outOfRange" });
  });

  it("flags a negative rate", () => {
    expect(parsePercent("-1")).toEqual({ ok: false, reason: "outOfRange" });
  });
});
