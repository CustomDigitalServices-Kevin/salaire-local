import { describe, expect, it } from "vitest";
import { APEC_PLAFOND, CSG_PLAFOND, PMSS, T2_PLAFOND, baremes } from "./baremes";

describe("baremes.json — frontmatter de veille", () => {
  it("porte une date et une last_review au format ISO", () => {
    expect(baremes.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(baremes.last_review).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(baremes.source.length).toBeGreaterThan(0);
    expect(baremes.annee).toBe(2026);
  });
});

describe("baremes.json — plafonds et tranches 2026", () => {
  it("expose PMSS 4005 et PASS 48060", () => {
    expect(PMSS).toBe(4005);
    expect(baremes.plafonds.pass).toBe(48060);
  });

  it("dérive T2 (8 PMSS), plafond CSG et APEC (4 PMSS)", () => {
    expect(T2_PLAFOND).toBe(32040);
    expect(CSG_PLAFOND).toBe(16020);
    expect(APEC_PLAFOND).toBe(16020);
  });
});

describe("baremes.json — taux salariés 2026", () => {
  it("aligne les taux sur la spec URSSAF/AGIRC-ARRCO", () => {
    expect(baremes.salarie.vieillesse_plafonnee).toBe(0.069);
    expect(baremes.salarie.vieillesse_deplafonnee).toBe(0.004);
    expect(baremes.salarie.agirc_arrco_t1).toBe(0.0315);
    expect(baremes.salarie.agirc_arrco_t2).toBe(0.0864);
    expect(baremes.salarie.ceg_t1).toBe(0.0086);
    expect(baremes.salarie.ceg_t2).toBe(0.0108);
    expect(baremes.salarie.cet).toBe(0.0014);
    expect(baremes.salarie.apec).toBe(0.00024);
    expect(baremes.salarie.maladie_alsace_moselle).toBe(0.013);
  });

  it("expose l'abattement CSG 1,75 % / assiette 98,25 %", () => {
    expect(baremes.csg_crds.assiette_ratio).toBe(0.9825);
    expect(baremes.csg_crds.abattement).toBe(0.0175);
    expect(baremes.csg_crds.csg_deductible).toBe(0.068);
    expect(baremes.csg_crds.csg_non_deductible).toBe(0.024);
    expect(baremes.csg_crds.crds).toBe(0.005);
  });
});

describe("baremes.json — micro-entrepreneur", () => {
  it("porte les 4 taux d'activité et flag le libéral BNC général", () => {
    expect(baremes.micro.activites.vente_marchandises_bic.taux).toBe(0.123);
    expect(baremes.micro.activites.prestations_services_bic.taux).toBe(0.212);
    expect(baremes.micro.activites.liberal_general_bnc.taux).toBe(0.256);
    expect(baremes.micro.activites.liberal_general_bnc.a_reverifier).toBe(true);
    expect(baremes.micro.activites.liberal_cipav_bnc.taux).toBe(0.232);
  });

  it("dates and sources the ACRE exemption change", () => {
    expect(baremes.last_review).toBe("2026-10-23");
    expect(baremes.micro).toHaveProperty("acre", {
      date_effet: "2026-07-01",
      taux_exoneration_avant: 0.5,
      taux_exoneration_a_partir: 0.25,
      source: {
        url: "https://entreprendre.service-public.gouv.fr/actualites/A18795",
        decret: "Décret n° 2026-69 du 6 février 2026",
      },
      last_review: "2026-10-23",
    });
    expect(baremes.micro).not.toHaveProperty("acre_reduction");
  });
});
