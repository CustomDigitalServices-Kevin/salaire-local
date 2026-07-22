import {
  APEC_PLAFOND,
  CSG_PLAFOND,
  PMSS,
  T2_PLAFOND,
  baremes,
} from "./baremes";
import { assertMontantPositif, assertTaux, round2 } from "./rounding";
import type { CotisationKey, CotisationLine, SalarieInput, SalarieResult } from "./types";

/**
 * CSG/CRDS base: 98.25 % of gross for the part up to 4 PMSS (the 1.75 %
 * abatement is capped at 4 PASS), then 100 % of gross above that ceiling.
 */
function csgBase(brut: number): number {
  const sousPlafond = Math.min(brut, CSG_PLAFOND);
  const auDessus = Math.max(0, brut - CSG_PLAFOND);
  return sousPlafond * baremes.csg_crds.assiette_ratio + auDessus;
}

/** Builds one contribution line, rounding the amount to the cent. */
function line(key: CotisationKey, taux: number, assiette: number): CotisationLine {
  return { key, taux, assiette, montant: round2(taux * assiette) };
}

/**
 * Computes the full gross-to-net breakdown for a private-sector employee,
 * strictly by tranche (T1 = gross up to 1 PMSS, T2 = part between 1 and 8 PMSS).
 *
 * Assumptions (surfaced in the UI): régime général secteur privé, temps plein,
 * hors heures supplémentaires. Employee sickness and unemployment rates are 0 %
 * (abolished) and are therefore not emitted. RGDU / ex-Fillon is 100 % employer
 * and does not affect the employee net, so it is deliberately excluded.
 */
export function computeSalarie(input: SalarieInput): SalarieResult {
  assertMontantPositif(input.brutMensuel, "Le brut mensuel");
  if (input.mutuellePatronale !== undefined) {
    assertMontantPositif(input.mutuellePatronale, "La part patronale mutuelle");
  }
  if (input.tauxPAS !== undefined) {
    assertTaux(input.tauxPAS, "Le taux de prélèvement à la source");
  }

  const brut = input.brutMensuel;
  const t1 = Math.min(brut, PMSS);
  const t2 = Math.max(0, Math.min(brut, T2_PLAFOND) - PMSS);
  const s = baremes.salarie;

  const candidates: CotisationLine[] = [
    line("vieillesse_plafonnee", s.vieillesse_plafonnee, t1),
    line("vieillesse_deplafonnee", s.vieillesse_deplafonnee, brut),
    line("csg_deductible", baremes.csg_crds.csg_deductible, csgBase(brut)),
    line("csg_non_deductible", baremes.csg_crds.csg_non_deductible, csgBase(brut)),
    line("crds", baremes.csg_crds.crds, csgBase(brut)),
    line("agirc_arrco_t1", s.agirc_arrco_t1, t1),
    line("agirc_arrco_t2", s.agirc_arrco_t2, t2),
    line("ceg_t1", s.ceg_t1, t1),
    line("ceg_t2", s.ceg_t2, t2),
    // CET: assiette T1+T2, applicable only when gross exceeds 1 PMSS.
    line("cet", s.cet, brut > PMSS ? Math.min(brut, T2_PLAFOND) : 0),
  ];

  // APEC: cadres only, assiette T1+T2 capped at 4 PMSS.
  if (input.cadre) {
    candidates.push(line("apec", s.apec, Math.min(brut, APEC_PLAFOND)));
  }

  // Alsace-Moselle local regime: employee sickness on the whole gross.
  if (input.alsaceMoselle === true) {
    candidates.push(line("maladie_alsace_moselle", s.maladie_alsace_moselle, brut));
  }

  const cotisations = candidates.filter((c) => c.montant > 0);
  const totalCotisations = round2(cotisations.reduce((sum, c) => sum + c.montant, 0));
  const netAPayer = round2(brut - totalCotisations);

  const csgNonDeductible = round2(baremes.csg_crds.csg_non_deductible * csgBase(brut));
  const crds = round2(baremes.csg_crds.crds * csgBase(brut));
  const mutuellePatronale = input.mutuellePatronale ?? 0;
  const netImposable = round2(netAPayer + csgNonDeductible + crds + mutuellePatronale);

  let impotPAS: number | null = null;
  let netApresImpot: number | null = null;
  if (input.tauxPAS !== undefined) {
    impotPAS = round2(netImposable * input.tauxPAS);
    netApresImpot = round2(netAPayer - impotPAS);
  }

  const tauxGlobalCharges = brut > 0 ? totalCotisations / brut : 0;

  return {
    brut,
    cotisations,
    totalCotisations,
    netAPayer,
    csgNonDeductible,
    crds,
    netImposable,
    impotPAS,
    netApresImpot,
    tauxGlobalCharges,
  };
}
