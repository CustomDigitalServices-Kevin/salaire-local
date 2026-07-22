import {
  brutFromNetAPayer,
  brutFromNetImposable,
  computeSalarie,
  type SalarieContext,
  type SalarieResult,
} from "../lib";

/** Which figure the user typed; drives whether the engine is inverted. */
export type SalarieDirection = "brut" | "netAPayer" | "netImposable";

/** Parsed, validated form state ready to feed the engine. */
export interface SalarieForm {
  /** The direction of the known amount. */
  direction: SalarieDirection;
  /** Monthly amount in euros for the chosen direction (>= 0). */
  amount: number;
  /** Cadre status (adds APEC). */
  cadre: boolean;
  /** Alsace-Moselle local regime (adds employee sickness). */
  alsaceMoselle: boolean;
  /** Employer-paid mutuelle share in euros, or null when not provided. */
  mutuellePatronale: number | null;
  /** Withholding-tax rate as a decimal (0..1), or null when not provided. */
  tauxPAS: number | null;
}

/**
 * Builds the engine context from the form, including optional fields only when
 * present. Explicit conditional spreads keep it compatible with
 * `exactOptionalPropertyTypes` (no `key: undefined`).
 */
function toContext(form: SalarieForm): SalarieContext {
  return {
    cadre: form.cadre,
    ...(form.alsaceMoselle ? { alsaceMoselle: true } : {}),
    ...(form.mutuellePatronale !== null ? { mutuellePatronale: form.mutuellePatronale } : {}),
    ...(form.tauxPAS !== null ? { tauxPAS: form.tauxPAS } : {}),
  };
}

/**
 * Resolves the monthly gross for the form, inverting the engine by bisection
 * when the user typed a net figure, then returns the full breakdown.
 *
 * Throws (via the engine guards) only on inputs the UI layer already rejects
 * (negative amount, out-of-range rate), so callers pass validated forms.
 */
export function resolveSalarie(form: SalarieForm): SalarieResult {
  const context = toContext(form);

  let brutMensuel: number;
  switch (form.direction) {
    case "brut":
      brutMensuel = form.amount;
      break;
    case "netAPayer":
      brutMensuel = brutFromNetAPayer(form.amount, context);
      break;
    case "netImposable":
      brutMensuel = brutFromNetImposable(form.amount, context);
      break;
  }

  return computeSalarie({ ...context, brutMensuel });
}
