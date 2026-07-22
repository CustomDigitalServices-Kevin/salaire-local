import baremesData from "../data/baremes.json";
import type { MicroActivite } from "./types";

/**
 * Typed view over `src/data/baremes.json`.
 *
 * ARCHITECTURE VEILLE: every rate lives in the JSON, never hard-coded in TS.
 * The JSON carries a `date` / `last_review` frontmatter so the UI can display
 * the barème vintage and prompt a re-check against urssaf.fr.
 */
export interface MicroActiviteRate {
  taux: number;
  a_reverifier: boolean;
}

export interface Baremes {
  date: string;
  last_review: string;
  source: string;
  annee: number;
  plafonds: {
    /** Plafond mensuel de la Sécurité sociale (€/mois). */
    pmss: number;
    /** Plafond annuel de la Sécurité sociale (€/an). */
    pass: number;
  };
  tranches: {
    /** T2 ceiling expressed in PMSS multiples (8). */
    t2_plafond_pmss: number;
    /** CSG/CRDS abatement ceiling in PMSS multiples (4 PASS ≡ 4 PMSS/mois). */
    csg_plafond_pmss: number;
    /** APEC assiette ceiling in PMSS multiples (4). */
    apec_plafond_pmss: number;
  };
  csg_crds: {
    /** Fraction of gross forming the CSG/CRDS base below the ceiling (0.9825). */
    assiette_ratio: number;
    /** Abatement rate (0.0175 = 1 - assiette_ratio). */
    abattement: number;
    csg_deductible: number;
    csg_non_deductible: number;
    crds: number;
  };
  salarie: {
    vieillesse_plafonnee: number;
    vieillesse_deplafonnee: number;
    agirc_arrco_t1: number;
    agirc_arrco_t2: number;
    ceg_t1: number;
    ceg_t2: number;
    cet: number;
    apec: number;
    maladie_alsace_moselle: number;
  };
  micro: {
    activites: Record<MicroActivite, MicroActiviteRate>;
    acre_reduction: number;
  };
  portage: {
    ratio_bas: number;
    ratio_central: number;
    ratio_haut: number;
  };
}

export const baremes: Baremes = baremesData;

/** Monthly Sécurité sociale ceiling (1 PMSS). */
export const PMSS = baremes.plafonds.pmss;

/** T2 upper ceiling in euros (8 PMSS). */
export const T2_PLAFOND = baremes.tranches.t2_plafond_pmss * PMSS;

/** CSG/CRDS abatement ceiling in euros (4 PMSS). */
export const CSG_PLAFOND = baremes.tranches.csg_plafond_pmss * PMSS;

/** APEC assiette ceiling in euros (4 PMSS). */
export const APEC_PLAFOND = baremes.tranches.apec_plafond_pmss * PMSS;
