import type { CotisationKey, MicroActivite } from "../lib";
import type { MessageKey } from "../i18n/messages";
import type { SalarieDirection } from "./salarie-controller";

/**
 * Maps each engine enum to its i18n message key. Declared as exhaustive
 * `Record`s so adding a new contribution / activity fails to compile until a
 * label is provided — no silent "missing translation" at runtime.
 */

export const COTISATION_LABEL_KEYS: Record<CotisationKey, MessageKey> = {
  vieillesse_plafonnee: "cotisation.vieillesse_plafonnee",
  vieillesse_deplafonnee: "cotisation.vieillesse_deplafonnee",
  csg_deductible: "cotisation.csg_deductible",
  csg_non_deductible: "cotisation.csg_non_deductible",
  crds: "cotisation.crds",
  agirc_arrco_t1: "cotisation.agirc_arrco_t1",
  agirc_arrco_t2: "cotisation.agirc_arrco_t2",
  ceg_t1: "cotisation.ceg_t1",
  ceg_t2: "cotisation.ceg_t2",
  cet: "cotisation.cet",
  apec: "cotisation.apec",
  maladie_alsace_moselle: "cotisation.maladie_alsace_moselle",
};

export const MICRO_ACTIVITE_LABEL_KEYS: Record<MicroActivite, MessageKey> = {
  vente_marchandises_bic: "micro.activite.vente_marchandises_bic",
  prestations_services_bic: "micro.activite.prestations_services_bic",
  liberal_general_bnc: "micro.activite.liberal_general_bnc",
  liberal_cipav_bnc: "micro.activite.liberal_cipav_bnc",
};

/** Ordered list of micro activities for the select control. */
export const MICRO_ACTIVITES: readonly MicroActivite[] = [
  "vente_marchandises_bic",
  "prestations_services_bic",
  "liberal_general_bnc",
  "liberal_cipav_bnc",
];

export const SALARIE_DIRECTION_LABEL_KEYS: Record<SalarieDirection, MessageKey> = {
  brut: "salarie.direction.brut",
  netAPayer: "salarie.direction.netAPayer",
  netImposable: "salarie.direction.netImposable",
};

/** Ordered list of directions for the segmented control. */
export const SALARIE_DIRECTIONS: readonly SalarieDirection[] = [
  "brut",
  "netAPayer",
  "netImposable",
];
