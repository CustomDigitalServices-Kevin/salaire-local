/**
 * Public domain types for the salaire brut/net engine.
 * No UI or framework dependency — safe to import from tests and workers.
 */

/** Micro-entrepreneur activity categories keyed to `baremes.json.micro.activites`. */
export type MicroActivite =
  | "vente_marchandises_bic"
  | "prestations_services_bic"
  | "liberal_general_bnc"
  | "liberal_cipav_bnc";

/** Stable identifiers for every salaried contribution line. */
export type CotisationKey =
  | "vieillesse_plafonnee"
  | "vieillesse_deplafonnee"
  | "csg_deductible"
  | "csg_non_deductible"
  | "crds"
  | "agirc_arrco_t1"
  | "agirc_arrco_t2"
  | "ceg_t1"
  | "ceg_t2"
  | "cet"
  | "apec"
  | "maladie_alsace_moselle";

/** One line of the payslip breakdown: rate applied to a base, giving an amount. */
export interface CotisationLine {
  /** Stable machine key (drives i18n labels in the UI). */
  key: CotisationKey;
  /** Rate applied (decimal, e.g. 0.069 for 6.90 %). */
  taux: number;
  /** Base the rate is applied to, in euros. */
  assiette: number;
  /** Resulting contribution amount in euros, rounded to the cent. */
  montant: number;
}

/** Inputs for a private-sector employee monthly calculation. */
export interface SalarieInput {
  /** Monthly gross salary in euros (>= 0). */
  brutMensuel: number;
  /** True for cadre status (adds APEC). */
  cadre: boolean;
  /** Alsace-Moselle local regime: adds employee sickness contribution. */
  alsaceMoselle?: boolean;
  /**
   * Employer-paid share of complementary health insurance, in euros.
   * When provided it is added to the taxable net (benefit in kind).
   */
  mutuellePatronale?: number;
  /**
   * Personalised withholding-tax rate (prélèvement à la source), decimal 0..1.
   * When provided, `netApresImpot` and `impotPAS` are computed. No family
   * quotient recomputation is performed — the rate is used verbatim.
   */
  tauxPAS?: number;
}

/** Full result of an employee gross-to-net calculation. */
export interface SalarieResult {
  /** Monthly gross used for the computation. */
  brut: number;
  /** Breakdown, one entry per applicable contribution (montant > 0). */
  cotisations: CotisationLine[];
  /** Sum of all contribution amounts. */
  totalCotisations: number;
  /** Net payable before income tax = brut - totalCotisations. */
  netAPayer: number;
  /** CSG non déductible amount (added back to taxable base). */
  csgNonDeductible: number;
  /** CRDS amount (added back to taxable base). */
  crds: number;
  /** Taxable net = netAPayer + csgNonDeductible + crds + employer mutuelle. */
  netImposable: number;
  /** Withholding tax = netImposable * tauxPAS, or null when no rate given. */
  impotPAS: number | null;
  /** Net after tax = netAPayer - impotPAS, or null when no rate given. */
  netApresImpot: number | null;
  /** Global contribution rate = totalCotisations / brut (0 when brut is 0). */
  tauxGlobalCharges: number;
}

/** Creation or takeover period relative to the ACRE reform effective on 2026-07-01. */
export type MicroPeriodeCreation = "avant_2026_07_01" | "a_partir_2026_07_01";

/** Inputs for the micro-entrepreneur social-contribution estimate. */
export interface MicroInput {
  /** Cashed-in turnover for the period, in euros (>= 0). */
  caEncaisse: number;
  /** Activity category, selects the forfaitaire rate. */
  activite: MicroActivite;
  /** True while the user benefits from the ACRE exemption. */
  acre?: boolean;
  /** Creation or takeover period; defaults to on or after 2026-07-01. */
  periodeCreation?: MicroPeriodeCreation;
}

/** Result of the micro-entrepreneur estimate (social contributions only). */
export interface MicroResult {
  /** Turnover used. */
  ca: number;
  activite: MicroActivite;
  /** Effective rate after any ACRE reduction. */
  taux: number;
  /** Full statutory rate before ACRE. */
  tauxPlein: number;
  /** Whether the ACRE reduction was applied. */
  acreApplique: boolean;
  /** Social contributions = ca * taux. */
  cotisations: number;
  /** Net after social contributions = ca - cotisations (excludes CFP, taxes, income tax). */
  net: number;
  /** True when this rate is flagged volatile and should be re-checked. */
  aReverifier: boolean;
}

/** Inputs for the portage salarial indicative estimate. */
export interface PortageInput {
  /** Billed turnover excluding VAT, in euros (>= 0). */
  caHT: number;
}

/** Indicative net range for portage salarial. */
export interface PortageResult {
  caHT: number;
  /** Central net estimate (caHT * ratio_central). */
  netEstime: number;
  /** Low bound of the indicative range. */
  fourchetteBasse: number;
  /** High bound of the indicative range. */
  fourchetteHaute: number;
}
