/**
 * Public API of the salaire brut/net engine.
 * Pure TypeScript, no UI dependency - consumed by the React layer and tests.
 */
export { computeSalarie } from "./salarie";
export {
  bisect,
  brutFromNetAPayer,
  brutFromNetImposable,
  type BisectionOptions,
  type SalarieContext,
} from "./inversion";
export { computeMicro } from "./micro";
export { computePortage } from "./portage";
export {
  baremes,
  PMSS,
  T2_PLAFOND,
  CSG_PLAFOND,
  APEC_PLAFOND,
  type Baremes,
  type MicroActiviteRate,
} from "./baremes";
export { round2, assertMontantPositif, assertTaux } from "./rounding";
export type {
  CotisationKey,
  CotisationLine,
  MicroActivite,
  MicroInput,
  MicroPeriodeCreation,
  MicroResult,
  PortageInput,
  PortageResult,
  SalarieInput,
  SalarieResult,
} from "./types";
