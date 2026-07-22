import { describe, expect, it } from "vitest";
import { computeSalarie } from "./salarie";
import { APEC_PLAFOND, CSG_PLAFOND, PMSS, T2_PLAFOND, baremes } from "./baremes";
import type { CotisationKey, CotisationLine } from "./types";

/** Helper: find a contribution line by key, or undefined when absent. */
function findLine(lines: readonly CotisationLine[], key: CotisationKey): CotisationLine | undefined {
  return lines.find((c) => c.key === key);
}

describe("computeSalarie — non-cadre sous 1 PMSS (brut 3000)", () => {
  const r = computeSalarie({ brutMensuel: 3000, cadre: false });

  it("émet exactement les 7 lignes applicables (ni T2, ni CET, ni APEC)", () => {
    expect(r.cotisations.map((c) => c.key)).toEqual([
      "vieillesse_plafonnee",
      "vieillesse_deplafonnee",
      "csg_deductible",
      "csg_non_deductible",
      "crds",
      "agirc_arrco_t1",
      "ceg_t1",
    ]);
  });

  it("calcule chaque montant au centime", () => {
    expect(findLine(r.cotisations, "vieillesse_plafonnee")?.montant).toBe(207);
    expect(findLine(r.cotisations, "vieillesse_deplafonnee")?.montant).toBe(12);
    expect(findLine(r.cotisations, "csg_deductible")?.montant).toBe(200.43);
    expect(findLine(r.cotisations, "csg_non_deductible")?.montant).toBe(70.74);
    expect(findLine(r.cotisations, "crds")?.montant).toBe(14.74);
    expect(findLine(r.cotisations, "agirc_arrco_t1")?.montant).toBe(94.5);
    expect(findLine(r.cotisations, "ceg_t1")?.montant).toBe(25.8);
  });

  it("agrège total, net à payer, net imposable et taux global", () => {
    expect(r.totalCotisations).toBe(625.21);
    expect(r.netAPayer).toBe(2374.79);
    expect(r.csgNonDeductible).toBe(70.74);
    expect(r.crds).toBe(14.74);
    expect(r.netImposable).toBe(2460.27);
    expect(r.tauxGlobalCharges).toBeCloseTo(625.21 / 3000, 10);
  });

  it("laisse impotPAS et netApresImpot à null sans taux PAS", () => {
    expect(r.impotPAS).toBeNull();
    expect(r.netApresImpot).toBeNull();
  });
});

describe("computeSalarie — assiettes par tranche", () => {
  it("borne T1 à 1 PMSS et calcule T2 entre 1 et 8 PMSS", () => {
    const r = computeSalarie({ brutMensuel: 5000, cadre: false });
    expect(findLine(r.cotisations, "agirc_arrco_t1")?.assiette).toBe(PMSS);
    expect(findLine(r.cotisations, "agirc_arrco_t2")?.assiette).toBe(5000 - PMSS);
    expect(findLine(r.cotisations, "vieillesse_plafonnee")?.assiette).toBe(PMSS);
  });

  it("plafonne T2 à 8 PMSS pour un très haut salaire", () => {
    const r = computeSalarie({ brutMensuel: 40000, cadre: true });
    expect(findLine(r.cotisations, "agirc_arrco_t2")?.assiette).toBe(T2_PLAFOND - PMSS);
    expect(findLine(r.cotisations, "cet")?.assiette).toBe(T2_PLAFOND);
    expect(findLine(r.cotisations, "apec")?.assiette).toBe(APEC_PLAFOND);
  });

  it("applique l'abattement CSG plafonné à 4 PASS au-delà du plafond", () => {
    const r = computeSalarie({ brutMensuel: 20000, cadre: true });
    const attendu = CSG_PLAFOND * baremes.csg_crds.assiette_ratio + (20000 - CSG_PLAFOND);
    expect(findLine(r.cotisations, "csg_deductible")?.assiette).toBeCloseTo(attendu, 6);
  });
});

describe("computeSalarie — CET uniquement au-dessus de 1 PMSS", () => {
  it("n'émet pas de CET quand brut <= 1 PMSS", () => {
    const r = computeSalarie({ brutMensuel: PMSS, cadre: false });
    expect(findLine(r.cotisations, "cet")).toBeUndefined();
  });

  it("émet la CET dès que brut dépasse 1 PMSS", () => {
    const r = computeSalarie({ brutMensuel: PMSS + 1, cadre: false });
    const cet = findLine(r.cotisations, "cet");
    expect(cet?.assiette).toBe(PMSS + 1);
    expect(cet?.taux).toBe(baremes.salarie.cet);
  });
});

describe("computeSalarie — statut cadre", () => {
  it("ajoute l'APEC pour un cadre", () => {
    const cadre = computeSalarie({ brutMensuel: 3000, cadre: true });
    expect(findLine(cadre.cotisations, "apec")?.montant).toBe(0.72);
    expect(cadre.totalCotisations).toBe(625.93);
    expect(cadre.netAPayer).toBe(2374.07);
  });

  it("n'ajoute pas d'APEC pour un non-cadre", () => {
    const nonCadre = computeSalarie({ brutMensuel: 3000, cadre: false });
    expect(findLine(nonCadre.cotisations, "apec")).toBeUndefined();
  });
});

describe("computeSalarie — options", () => {
  it("ajoute la maladie salariale Alsace-Moselle sur tout le brut", () => {
    const r = computeSalarie({ brutMensuel: 3000, cadre: false, alsaceMoselle: true });
    expect(findLine(r.cotisations, "maladie_alsace_moselle")?.montant).toBe(39);
    expect(r.netAPayer).toBe(2335.79);
  });

  it("ajoute la part patronale mutuelle au net imposable seulement", () => {
    const r = computeSalarie({ brutMensuel: 3000, cadre: false, mutuellePatronale: 50 });
    expect(r.netImposable).toBe(2510.27);
    expect(r.netAPayer).toBe(2374.79);
  });

  it("calcule impôt PAS et net après impôt avec un taux personnalisé", () => {
    const r = computeSalarie({ brutMensuel: 3000, cadre: false, tauxPAS: 0.1 });
    expect(r.impotPAS).toBe(246.03);
    expect(r.netApresImpot).toBe(2128.76);
  });
});

describe("computeSalarie — taux salariés abrogés jamais émis", () => {
  it("n'émet ni maladie standard ni chômage salarial", () => {
    const r = computeSalarie({ brutMensuel: 6000, cadre: true });
    const keys = r.cotisations.map((c) => c.key);
    expect(keys).not.toContain("maladie");
    expect(keys).not.toContain("chomage");
  });
});

describe("computeSalarie — cas limites et validation", () => {
  it("retourne un net nul et un taux 0 pour un brut de 0", () => {
    const r = computeSalarie({ brutMensuel: 0, cadre: false });
    expect(r.cotisations).toEqual([]);
    expect(r.totalCotisations).toBe(0);
    expect(r.netAPayer).toBe(0);
    expect(r.tauxGlobalCharges).toBe(0);
  });

  it("rejette un brut négatif", () => {
    expect(() => computeSalarie({ brutMensuel: -1, cadre: false })).toThrow(RangeError);
  });

  it("rejette un taux PAS hors [0,1]", () => {
    expect(() => computeSalarie({ brutMensuel: 3000, cadre: false, tauxPAS: 1.2 })).toThrow(RangeError);
  });

  it("rejette une part patronale mutuelle négative", () => {
    expect(() => computeSalarie({ brutMensuel: 3000, cadre: false, mutuellePatronale: -5 })).toThrow(
      RangeError,
    );
  });
});
