export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const fr = {
  "app.title": "Salaire brut / net France 2026",
  "app.tagline":
    "Estimez votre salaire net à partir du brut (ou l'inverse), avec le détail de chaque cotisation.",
  "app.localBanner":
    "100% local : le calcul s'effectue dans votre navigateur, aucune donnée transmise.",

  "nav.home": "Accueil",
  "nav.privacy": "Confidentialité et RGPD",
  "nav.licenses": "Licences tierces",

  "hypotheses.title": "Hypothèses de calcul",
  "hypotheses.intro":
    "Ces paramètres cadrent l'estimation. En dehors de ce périmètre, le résultat n'est pas fiable.",
  "hypotheses.item.regime":
    "Régime général, secteur privé, hors Alsace-Moselle (sauf option maladie +1,30%).",
  "hypotheses.item.fulltime": "Temps plein, hors heures supplémentaires.",
  "hypotheses.item.mutuelle":
    "Mutuelle et prévoyance surcomplémentaires non incluses, sauf champ optionnel.",
  "hypotheses.item.fillon":
    "La réduction générale de cotisations patronales (ex-Fillon) est 100% patronale et n'affecte pas le net salarié.",
  "hypotheses.verify": "Vérifier sur urssaf.fr",

  "footer.brand": "Custom Digital Services",

  "trust.gdpr.title": "Conforme RGPD par design",
  "trust.gdpr.body":
    "Aucune donnée ne transite : la politique de sécurité (CSP) du navigateur bloque techniquement tout envoi.",
  "trust.offline.title": "Fonctionne hors ligne",
  "trust.offline.body":
    "Une fois chargé, l'outil est mis en cache : calculez même sans connexion.",
  "trust.opensource.title": "Open source (MIT)",
  "trust.opensource.body":
    "Code source public sous licence MIT. Aucun tracker, aucun cookie, aucune inscription.",

  "calc.tab.salarie": "Salarié",
  "calc.tab.micro": "Micro-entrepreneur",
  "calc.tab.portage": "Portage salarial",
  "calc.baremeLabel": "Barèmes en vigueur :",
  "calc.source": "Source",

  "common.optional": "(optionnel)",
  "common.approx": "soit",
  "common.perYear": "par an",

  "salarie.direction.label": "Je connais le",
  "salarie.direction.brut": "Salaire brut",
  "salarie.direction.netAPayer": "Net à payer",
  "salarie.direction.netImposable": "Net imposable",
  "salarie.amount.label": "Montant mensuel",
  "salarie.amount.placeholder": "ex. 3 000",
  "salarie.status.title": "Statut",
  "salarie.cadre.label": "Statut cadre",
  "salarie.cadre.hint": "Ajoute la cotisation APEC (0,024%).",
  "salarie.alsace.label": "Alsace-Moselle",
  "salarie.alsace.hint": "Ajoute la cotisation maladie salariale locale (+1,30%).",
  "salarie.options.title": "Options avancées",
  "salarie.options.subtitle": "Laissez vide pour ignorer.",
  "salarie.mutuelle.label": "Part patronale mutuelle",
  "salarie.mutuelle.hint": "Réintégrée au net imposable (avantage en nature).",
  "salarie.pas.label": "Taux de prélèvement à la source (%)",
  "salarie.pas.hint": "Taux personnalisé. Aucun recalcul du quotient familial.",
  "salarie.reset": "Réinitialiser",

  "result.title": "Résultat",
  "result.netAPayer": "Net à payer",
  "result.netAPayer.hint": "Avant impôt sur le revenu.",
  "result.brut": "Salaire brut mensuel",
  "result.detailTitle": "Détail des cotisations salariales",
  "result.column.cotisation": "Cotisation",
  "result.column.base": "Assiette",
  "result.column.rate": "Taux",
  "result.column.amount": "Montant",
  "result.totalCotisations": "Total cotisations salariales",
  "result.netImposable": "Net imposable",
  "result.netImposable.hint": "Base du prélèvement à la source.",
  "result.impotPAS": "Prélèvement à la source",
  "result.netApresImpot": "Net après impôt",
  "result.tauxGlobal": "Taux global de charges",
  "result.empty": "Saisissez un montant pour lancer le calcul.",

  "cotisation.vieillesse_plafonnee": "Assurance vieillesse plafonnée",
  "cotisation.vieillesse_deplafonnee": "Assurance vieillesse déplafonnée",
  "cotisation.csg_deductible": "CSG déductible",
  "cotisation.csg_non_deductible": "CSG non déductible",
  "cotisation.crds": "CRDS",
  "cotisation.agirc_arrco_t1": "Retraite complémentaire Agirc-Arrco (T1)",
  "cotisation.agirc_arrco_t2": "Retraite complémentaire Agirc-Arrco (T2)",
  "cotisation.ceg_t1": "Contribution d'équilibre général (T1)",
  "cotisation.ceg_t2": "Contribution d'équilibre général (T2)",
  "cotisation.cet": "Contribution d'équilibre technique",
  "cotisation.apec": "APEC (cadres)",
  "cotisation.maladie_alsace_moselle": "Maladie Alsace-Moselle",

  "micro.ca.label": "Chiffre d'affaires encaissé",
  "micro.ca.placeholder": "ex. 10 000",
  "micro.activite.label": "Activité",
  "micro.activite.vente_marchandises_bic": "Vente de marchandises (BIC)",
  "micro.activite.prestations_services_bic": "Prestations de services (BIC)",
  "micro.activite.liberal_general_bnc": "Activité libérale (BNC)",
  "micro.activite.liberal_cipav_bnc": "Activité libérale CIPAV (BNC)",
  "micro.acre.label": "Bénéficiaire de l'ACRE",
  "micro.acre.hint.before": "Création ou reprise avant le 1er juillet 2026. Taux ACRE de votre activité :",
  "micro.acre.hint.since": "Création ou reprise à partir du 1er juillet 2026. Taux ACRE de votre activité :",
  "micro.acre.duration": "Taux réduit jusqu'à la fin du 3e trimestre civil qui suit le début d'activité.",
  "micro.acre.scope": "Le simulateur ne proratise pas : le résultat suppose que tout le chiffre d'affaires saisi relève de la période à taux réduit.",
  "micro.acre.creation.label": "Date de création ou de reprise",
  "micro.acre.creation.before": "Avant le 1er juillet 2026",
  "micro.acre.creation.since": "À partir du 1er juillet 2026",
  "micro.acre.source": "Source : Urssaf, taux ACRE par activité",
  "micro.result.title": "Estimation",
  "micro.result.taux": "Taux de cotisations appliqué",
  "micro.result.cotisations": "Cotisations sociales",
  "micro.result.net": "Net après cotisations sociales",
  "micro.result.reverifier": "Taux volatil, à revérifier sur urssaf.fr.",
  "micro.note":
    "Cotisations sociales uniquement. Hors CFP, taxe pour frais de chambre et impôt sur le revenu.",
  "micro.empty": "Saisissez un chiffre d'affaires pour lancer l'estimation.",

  "portage.ca.label": "Chiffre d'affaires HT facturé",
  "portage.ca.placeholder": "ex. 5 000",
  "portage.result.title": "Estimation indicative",
  "portage.result.net": "Net estimé",
  "portage.result.range": "Fourchette indicative",
  "portage.note":
    "Estimation indicative : le net dépend des frais de gestion de la société de portage, généralement autour de 50% du CA HT.",
  "portage.empty": "Saisissez un chiffre d'affaires HT pour lancer l'estimation.",

  "error.invalidAmount": "Saisissez un montant valide.",
  "error.negative": "Le montant doit être positif.",
  "error.invalidRate": "Le taux doit être compris entre 0 et 100.",

  "privacy.title": "Confidentialité et RGPD",
  "privacy.back": "Retour à l'accueil",
  "privacy.intro.title": "Vos données restent chez vous",
  "privacy.intro.body":
    "Ce simulateur fonctionne entièrement dans votre navigateur. Aucun montant, aucune donnée saisie n'est jamais envoyé à un serveur, y compris le nôtre.",
  "privacy.local.title": "Calcul 100% local",
  "privacy.local.body":
    "Le calcul s'exécute côté client à partir des barèmes publics embarqués dans l'application. Une fois le code chargé, l'outil fonctionne hors ligne : vos informations ne transitent jamais sur le réseau.",
  "privacy.data.title": "Aucune donnée personnelle collectée",
  "privacy.data.body":
    "Nous ne collectons aucune donnée personnelle, aucun identifiant, aucune adresse email. Il n'y a pas de compte utilisateur, pas de base de données, pas d'analytics tiers embarqué.",
  "privacy.cookies.title": "Pas de cookies",
  "privacy.cookies.body":
    "Cette application ne dépose aucun cookie. Votre préférence de langue est conservée uniquement en mémoire le temps de la session.",

  "licenses.title": "Licences tierces",
  "licenses.back": "Retour à l'accueil",
  "licenses.intro":
    "Ce simulateur est un logiciel libre publié sous licence MIT. Il s'appuie sur les bibliothèques open source suivantes, exécutées entièrement dans votre navigateur.",
  "licenses.columnLibrary": "Bibliothèque",
  "licenses.columnLicense": "Licence",
} as const;

export type MessageKey = keyof typeof fr;

const en: Record<MessageKey, string> = {
  "app.title": "Gross / Net Salary France 2026",
  "app.tagline":
    "Estimate your net salary from the gross (or the reverse), with a breakdown of every contribution.",
  "app.localBanner":
    "100% local: the calculation runs in your browser, no data is transmitted.",

  "nav.home": "Home",
  "nav.privacy": "Privacy & GDPR",
  "nav.licenses": "Third-party licenses",

  "hypotheses.title": "Calculation assumptions",
  "hypotheses.intro":
    "These parameters frame the estimate. Outside this scope, the result is not reliable.",
  "hypotheses.item.regime":
    "General scheme, private sector, excluding Alsace-Moselle (unless the +1.30% health option is enabled).",
  "hypotheses.item.fulltime": "Full time, excluding overtime.",
  "hypotheses.item.mutuelle":
    "Supplementary health and provident insurance are not included, except via the optional field.",
  "hypotheses.item.fillon":
    "The general employer contribution reduction (formerly Fillon) is 100% employer-side and does not affect the employee net.",
  "hypotheses.verify": "Check on urssaf.fr",

  "footer.brand": "Custom Digital Services",

  "trust.gdpr.title": "GDPR-compliant by design",
  "trust.gdpr.body":
    "No data ever transits: the browser's security policy (CSP) technically blocks any upload.",
  "trust.offline.title": "Works offline",
  "trust.offline.body": "Once loaded, the tool is cached: calculate even without a connection.",
  "trust.opensource.title": "Open source (MIT)",
  "trust.opensource.body":
    "Publicly available source code under the MIT license. No tracker, no cookie, no sign-up.",

  "calc.tab.salarie": "Employee",
  "calc.tab.micro": "Micro-entrepreneur",
  "calc.tab.portage": "Umbrella company",
  "calc.baremeLabel": "Rates effective:",
  "calc.source": "Source",

  "common.optional": "(optional)",
  "common.approx": "i.e.",
  "common.perYear": "per year",

  "salarie.direction.label": "I know the",
  "salarie.direction.brut": "Gross salary",
  "salarie.direction.netAPayer": "Net pay",
  "salarie.direction.netImposable": "Taxable net",
  "salarie.amount.label": "Monthly amount",
  "salarie.amount.placeholder": "e.g. 3,000",
  "salarie.status.title": "Status",
  "salarie.cadre.label": "Managerial status (cadre)",
  "salarie.cadre.hint": "Adds the APEC contribution (0.024%).",
  "salarie.alsace.label": "Alsace-Moselle",
  "salarie.alsace.hint": "Adds the local employee sickness contribution (+1.30%).",
  "salarie.options.title": "Advanced options",
  "salarie.options.subtitle": "Leave blank to skip.",
  "salarie.mutuelle.label": "Employer health-insurance share",
  "salarie.mutuelle.hint": "Added back to the taxable net (benefit in kind).",
  "salarie.pas.label": "Withholding tax rate (%)",
  "salarie.pas.hint": "Custom rate. No family-quotient recomputation.",
  "salarie.reset": "Reset",

  "result.title": "Result",
  "result.netAPayer": "Net pay",
  "result.netAPayer.hint": "Before income tax.",
  "result.brut": "Monthly gross salary",
  "result.detailTitle": "Employee contribution breakdown",
  "result.column.cotisation": "Contribution",
  "result.column.base": "Base",
  "result.column.rate": "Rate",
  "result.column.amount": "Amount",
  "result.totalCotisations": "Total employee contributions",
  "result.netImposable": "Taxable net",
  "result.netImposable.hint": "Withholding-tax base.",
  "result.impotPAS": "Withholding tax",
  "result.netApresImpot": "Net after tax",
  "result.tauxGlobal": "Overall contribution rate",
  "result.empty": "Enter an amount to run the calculation.",

  "cotisation.vieillesse_plafonnee": "Capped old-age insurance",
  "cotisation.vieillesse_deplafonnee": "Uncapped old-age insurance",
  "cotisation.csg_deductible": "Deductible CSG",
  "cotisation.csg_non_deductible": "Non-deductible CSG",
  "cotisation.crds": "CRDS",
  "cotisation.agirc_arrco_t1": "Agirc-Arrco supplementary pension (T1)",
  "cotisation.agirc_arrco_t2": "Agirc-Arrco supplementary pension (T2)",
  "cotisation.ceg_t1": "General balance contribution (T1)",
  "cotisation.ceg_t2": "General balance contribution (T2)",
  "cotisation.cet": "Technical balance contribution",
  "cotisation.apec": "APEC (cadres)",
  "cotisation.maladie_alsace_moselle": "Alsace-Moselle sickness",

  "micro.ca.label": "Cashed-in turnover",
  "micro.ca.placeholder": "e.g. 10,000",
  "micro.activite.label": "Activity",
  "micro.activite.vente_marchandises_bic": "Sale of goods (BIC)",
  "micro.activite.prestations_services_bic": "Services (BIC)",
  "micro.activite.liberal_general_bnc": "Liberal profession (BNC)",
  "micro.activite.liberal_cipav_bnc": "Liberal profession CIPAV (BNC)",
  "micro.acre.label": "ACRE beneficiary",
  "micro.acre.hint.before": "Creation or takeover before 1 July 2026. ACRE rate for your activity:",
  "micro.acre.hint.since": "Creation or takeover on or after 1 July 2026. ACRE rate for your activity:",
  "micro.acre.duration": "Reduced rate until the end of the third calendar quarter after the business starts.",
  "micro.acre.scope": "The simulator does not prorate: the result assumes all entered turnover falls within the reduced-rate period.",
  "micro.acre.creation.label": "Creation or takeover date",
  "micro.acre.creation.before": "Before 1 July 2026",
  "micro.acre.creation.since": "On or after 1 July 2026",
  "micro.acre.source": "Source: Urssaf, ACRE rates by activity",
  "micro.result.title": "Estimate",
  "micro.result.taux": "Applied contribution rate",
  "micro.result.cotisations": "Social contributions",
  "micro.result.net": "Net after social contributions",
  "micro.result.reverifier": "Volatile rate, re-check on urssaf.fr.",
  "micro.note":
    "Social contributions only. Excludes CFP, chamber-fee tax and income tax.",
  "micro.empty": "Enter a turnover to run the estimate.",

  "portage.ca.label": "Billed turnover excl. VAT",
  "portage.ca.placeholder": "e.g. 5,000",
  "portage.result.title": "Indicative estimate",
  "portage.result.net": "Estimated net",
  "portage.result.range": "Indicative range",
  "portage.note":
    "Indicative estimate: the net depends on the umbrella company's management fees, typically around 50% of turnover excl. VAT.",
  "portage.empty": "Enter a turnover excl. VAT to run the estimate.",

  "error.invalidAmount": "Enter a valid amount.",
  "error.negative": "The amount must be positive.",
  "error.invalidRate": "The rate must be between 0 and 100.",

  "privacy.title": "Privacy & GDPR",
  "privacy.back": "Back to home",
  "privacy.intro.title": "Your data stays with you",
  "privacy.intro.body":
    "This simulator runs entirely in your browser. No amount, no entered data is ever sent to a server, including ours.",
  "privacy.local.title": "100% local calculation",
  "privacy.local.body":
    "The calculation runs client-side from the public rates bundled into the application. Once the code is loaded, the tool works offline: your information never travels over the network.",
  "privacy.data.title": "No personal data collected",
  "privacy.data.body":
    "We collect no personal data, no identifiers, no email address. There is no user account, no database, no third-party analytics embedded.",
  "privacy.cookies.title": "No cookies",
  "privacy.cookies.body":
    "This application sets no cookies. Your language preference is kept only in memory for the duration of the session.",

  "licenses.title": "Third-party licenses",
  "licenses.back": "Back to home",
  "licenses.intro":
    "This simulator is free software released under the MIT license. It relies on the following open source libraries, all running entirely in your browser.",
  "licenses.columnLibrary": "Library",
  "licenses.columnLicense": "License",
};

export const messages: Record<Locale, Record<MessageKey, string>> = { fr, en };

export function detectLocale(): Locale {
  const candidates = typeof navigator === "undefined" ? [] : navigator.languages;
  for (const lang of candidates) {
    if (lang.toLowerCase().startsWith("fr")) return "fr";
    if (lang.toLowerCase().startsWith("en")) return "en";
  }
  return "fr";
}
