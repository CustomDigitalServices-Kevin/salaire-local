import type { Locale } from "../i18n/messages";

/**
 * Locale-aware formatting and input parsing for the salary simulator.
 *
 * Pure functions, no DOM/React dependency - unit-tested in isolation. The UI
 * keeps raw strings in state and calls these to derive numbers (parse) and to
 * render results (format), so every euro/percent shown on screen goes through
 * one audited path.
 */

const INTL_LOCALE: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

/** Formats a number as euros with two decimals, in the active locale. */
export function formatEuros(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a decimal rate as a percentage (0.069 → "6,9 %"). Up to three
 * fraction digits so sub-percent rates like APEC (0.024 %) stay readable.
 */
export function formatPercent(rate: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(rate);
}

/**
 * Formats an ISO `YYYY-MM-DD` string as a long localised date, building the
 * Date from local parts so the displayed day never shifts across time zones.
 */
export function formatIsoDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map((part) => Number.parseInt(part, 10));
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return iso;
  }
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long" }).format(date);
}

/** Reason an amount input could not be turned into a usable number. */
export type AmountParseError = "empty" | "invalid" | "negative";

/** Discriminated result of {@link parseAmount}. */
export type AmountParseResult =
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly reason: AmountParseError };

/**
 * Normalises a user-typed amount, tolerating FR and EN conventions:
 * spaces / non-breaking spaces as thousands separators, and either `,` or `.`
 * as the decimal separator. Returns a discriminated result so the UI can show
 * "empty" (no result yet, no error) distinctly from a real error.
 */
export function parseAmount(raw: string): AmountParseResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }

  const normalized = normalizeDecimal(trimmed);
  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return { ok: false, reason: "invalid" };
  }
  if (value < 0) {
    return { ok: false, reason: "negative" };
  }
  return { ok: true, value };
}

/** Reason a percentage input could not be turned into a usable rate. */
export type PercentParseError = "empty" | "invalid" | "outOfRange";

/** Discriminated result of {@link parsePercent}. `value` is a decimal (0..1). */
export type PercentParseResult =
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly reason: PercentParseError };

/**
 * Parses a percentage entered as 0..100 and returns it as a decimal rate
 * (12.5 → 0.125). Rates outside [0, 100] are rejected.
 */
export function parsePercent(raw: string): PercentParseResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }

  const normalized = normalizeDecimal(trimmed.replace(/%/g, ""));
  const percent = Number(normalized);
  if (!Number.isFinite(percent)) {
    return { ok: false, reason: "invalid" };
  }
  if (percent < 0 || percent > 100) {
    return { ok: false, reason: "outOfRange" };
  }
  return { ok: true, value: percent / 100 };
}

/**
 * Strips thousands separators (spaces, NBSP, narrow NBSP) and unifies the
 * decimal separator to `.`. When both `,` and `.` appear, the last one is
 * treated as the decimal separator and the other as a thousands separator.
 */
function normalizeDecimal(input: string): string {
  const withoutSpaces = input.replace(/\s/g, "");
  const lastComma = withoutSpaces.lastIndexOf(",");
  const lastDot = withoutSpaces.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalIsComma = lastComma > lastDot;
    return decimalIsComma
      ? withoutSpaces.replace(/\./g, "").replace(",", ".")
      : withoutSpaces.replace(/,/g, "");
  }
  if (lastComma !== -1) {
    return withoutSpaces.replace(",", ".");
  }
  return withoutSpaces;
}
