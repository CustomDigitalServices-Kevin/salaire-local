import { baremes } from "./baremes";
import { assertMontantPositif, round2 } from "./rounding";
import type { MicroInput, MicroResult } from "./types";

/**
 * Micro-entrepreneur social-contribution estimate.
 *
 * Base = cashed-in turnover. Covers social contributions only — it excludes the
 * CFP (contribution à la formation professionnelle), the taxe pour frais de
 * chambre, and income tax, which are out of scope of this simulator.
 *
 * ACRE, when opted in, halves the statutory rate for the first year.
 */
export function computeMicro(input: MicroInput): MicroResult {
  assertMontantPositif(input.caEncaisse, "Le chiffre d'affaires encaissé");

  const activiteRate = baremes.micro.activites[input.activite];
  const tauxPlein = activiteRate.taux;
  const acreApplique = input.acre === true;
  const taux = acreApplique ? tauxPlein * baremes.micro.acre_reduction : tauxPlein;

  const cotisations = round2(input.caEncaisse * taux);
  const net = round2(input.caEncaisse - cotisations);

  return {
    ca: input.caEncaisse,
    activite: input.activite,
    taux,
    tauxPlein,
    acreApplique,
    cotisations,
    net,
    aReverifier: activiteRate.a_reverifier,
  };
}
