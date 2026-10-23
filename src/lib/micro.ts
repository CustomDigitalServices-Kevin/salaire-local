import { baremes } from "./baremes";
import { assertMontantPositif, round2 } from "./rounding";
import type { MicroInput, MicroResult } from "./types";

/**
 * Micro-entrepreneur social-contribution estimate.
 *
 * Base = cashed-in turnover. Covers social contributions only; it excludes the
 * CFP (contribution à la formation professionnelle), the taxe pour frais de
 * chambre, and income tax, which are out of scope of this simulator.
 *
 * During ACRE, use URSSAF's published rate for the activity and creation or
 * takeover period. The default is the regime effective from 2026-07-01.
 */
export function computeMicro(input: MicroInput): MicroResult {
  assertMontantPositif(input.caEncaisse, "Le chiffre d'affaires encaissé");

  const activiteRate = baremes.micro.activites[input.activite];
  const tauxPlein = activiteRate.taux;
  const acreApplique = input.acre === true;
  const periodeCreation = input.periodeCreation ?? "a_partir_2026_07_01";
  const taux = acreApplique
    ? baremes.micro.acre.taux[periodeCreation][input.activite].taux
    : tauxPlein;

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
