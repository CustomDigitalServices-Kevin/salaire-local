import { computeSalarie } from "./salarie";
import { assertMontantPositif, round2 } from "./rounding";
import type { SalarieInput } from "./types";

/** Options controlling the bisection solver. */
export interface BisectionOptions {
  /** Iteration count (default 20 → converges below the cent). */
  iterations?: number;
  /**
   * Upper-bound multiplier applied to the target: gross is searched in
   * [target, target * hiFactor]. Employee contributions never exceed ~28 %,
   * so gross < target / 0.72 < target * 2; the default 2 leaves a safe margin.
   */
  hiFactor?: number;
}

/**
 * Generic monotone bisection: finds `x` such that `f(x) ≈ target` on the
 * interval [target, target * hiFactor], assuming `f` is non-decreasing.
 *
 * Used instead of an analytic inversion because the CSG on 98.25 % of gross
 * (with its 4-PASS-capped abatement) makes net-to-gross non-trivial to invert
 * in closed form.
 */
export function bisect(
  target: number,
  f: (x: number) => number,
  options?: BisectionOptions,
): number {
  assertMontantPositif(target, "La cible");
  if (target === 0) {
    return 0;
  }
  const iterations = options?.iterations ?? 20;
  const hiFactor = options?.hiFactor ?? 2;
  let lo = target;
  let hi = target * hiFactor;
  for (let i = 0; i < iterations; i += 1) {
    const mid = (lo + hi) / 2;
    if (f(mid) < target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return round2((lo + hi) / 2);
}

/** Fields that parameterise the calculation without fixing the gross. */
export type SalarieContext = Omit<SalarieInput, "brutMensuel">;

/**
 * Inverts the engine: returns the monthly gross whose *net à payer avant impôt*
 * equals `netAPayerCible`, for the given context (cadre, Alsace-Moselle, …).
 */
export function brutFromNetAPayer(netAPayerCible: number, context: SalarieContext): number {
  assertMontantPositif(netAPayerCible, "Le net à payer cible");
  return bisect(
    netAPayerCible,
    (brut) => computeSalarie({ ...context, brutMensuel: brut }).netAPayer,
  );
}

/**
 * Inverts the engine on the *net imposable*: returns the monthly gross whose
 * taxable net equals `netImposableCible`.
 */
export function brutFromNetImposable(netImposableCible: number, context: SalarieContext): number {
  assertMontantPositif(netImposableCible, "Le net imposable cible");
  return bisect(
    netImposableCible,
    (brut) => computeSalarie({ ...context, brutMensuel: brut }).netImposable,
  );
}
