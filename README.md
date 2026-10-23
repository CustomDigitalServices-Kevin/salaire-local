# Salaire brut / net France 2026 (local)

Simulateur de salaire brut/net pour le régime général français, fonctionnant
**100% dans le navigateur**. Aucun montant saisi n'est envoyé à un serveur : le
calcul s'exécute côté client à partir des barèmes publics embarqués dans
l'application (CSP stricte `connect-src 'self'`).

15e outil de la suite d'outils locaux Custom Digital Services.

## Fonctionnalités visées

- Conversion bidirectionnelle brut ↔ net par tranche (T1/T2), pas de forfait.
- Toggle cadre / non-cadre (cotisation APEC).
- Détail cotisation par ligne, net à payer, net imposable, net après impôt.
- Calculateur micro-entrepreneur (vente, prestations BIC, libéral BNC/CIPAV).
- Estimation indicative portage salarial.
- Barèmes centralisés et datés dans `src/data/baremes.json` (aucun taux en dur).
- Interface FR / EN, dark-only, RGPD par design.

## Stack

- Vite 7 + React 19 + TypeScript 5.8 (strict)
- Tailwind v4 (`@tailwindcss/vite`)
- PWA (`vite-plugin-pwa`) pour le fonctionnement hors ligne
- Vitest + Testing Library (unitaires) + Playwright (E2E)

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | `tsc --noEmit` puis build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | ESLint (strict type-checked) |
| `npm run typecheck` | Vérification TypeScript seule |
| `npm test` | Tests unitaires Vitest |
| `npm run test:e2e` | Tests end-to-end Playwright |
| `npm run check:licenses` | Refuse toute dépendance AGPL/LGPL |

## Licence

MIT — Custom Digital Services (Kevin Tomas).

## À propos

Conçu et maintenu par [Kevin Tomas](https://www.custom-digital-services.com/?utm_source=github&utm_medium=readme&utm_campaign=salaire-local), consultant freelance Power Platform et IA Microsoft (Custom Digital Services).
Autres outils gratuits : [www.custom-digital-services.com/outils](https://www.custom-digital-services.com/outils/?utm_source=github&utm_medium=readme&utm_campaign=salaire-local)
