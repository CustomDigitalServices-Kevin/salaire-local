/**
 * Rounds a monetary amount to the cent (2 decimals), half away from zero,
 * matching French payslip conventions.
 *
 * Uses an epsilon nudge so that base-2 float artefacts (e.g. 14.7375 stored as
 * 14.737499999…) still round the way a human reading the exact decimal would.
 */
export function round2(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`round2 attend un nombre fini, reçu: ${String(value)}`);
  }
  const sign = value < 0 ? -1 : 1;
  const scaled = Math.abs(value) * 100;
  return (sign * Math.round(scaled + Number.EPSILON * scaled)) / 100;
}

/**
 * Validates that a value is a finite number >= 0, throwing a French-labelled
 * RangeError otherwise. Used to guard every public engine entry point.
 */
export function assertMontantPositif(value: number, champ: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${champ} doit être un nombre positif ou nul, reçu: ${String(value)}`);
  }
}

/**
 * Validates that a rate is a finite number within [0, 1].
 */
export function assertTaux(value: number, champ: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${champ} doit être un taux entre 0 et 1, reçu: ${String(value)}`);
  }
}
