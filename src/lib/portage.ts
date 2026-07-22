import { baremes } from "./baremes";
import { assertMontantPositif, round2 } from "./rounding";
import type { PortageInput, PortageResult } from "./types";

/**
 * Portage salarial indicative estimate.
 *
 * This is explicitly a *fourchette* (range), not an exact net: portage companies
 * charge management fees and social contributions that vary by provider, so net
 * typically lands around 50 % of billed turnover excluding VAT (ratio_central),
 * within a 45–55 % band. Values come from `baremes.json.portage`.
 */
export function computePortage(input: PortageInput): PortageResult {
  assertMontantPositif(input.caHT, "Le chiffre d'affaires HT");

  return {
    caHT: input.caHT,
    netEstime: round2(input.caHT * baremes.portage.ratio_central),
    fourchetteBasse: round2(input.caHT * baremes.portage.ratio_bas),
    fourchetteHaute: round2(input.caHT * baremes.portage.ratio_haut),
  };
}
