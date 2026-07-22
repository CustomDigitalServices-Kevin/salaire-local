import { expect, test } from "@playwright/test";

/**
 * End-to-end coverage of the two main calculation journeys, driven through the
 * real UI. The exact figures mirror the engine's unit tests so a regression in
 * wiring surfaces here too.
 *
 * The app auto-detects its locale from `navigator.languages` (detectLocale),
 * so we pin the browser context to fr-FR to exercise the French UI and its
 * French number formatting deterministically, independent of the host machine.
 *
 * Intl formats EUR with a narrow no-break space (U+202F) as thousands separator,
 * so assertions use `.` (matches any single char) between the thousands and the
 * hundreds rather than a literal space.
 */
test.use({ locale: "fr-FR" });

test("parcours salarié : 3000 € brut non-cadre → net à payer 2 374,79 €", async ({ page }) => {
  await page.goto("/");

  // No result until an amount is entered.
  await expect(page.getByTestId("salarie-results")).toHaveCount(0);

  await page.getByLabel("Montant mensuel").fill("3000");

  const results = page.getByTestId("salarie-results");
  await expect(results).toBeVisible();
  // Headline net à payer.
  await expect(results).toContainText(/2.374,79/);
  // Overall contribution rate is surfaced (625,21 / 3000 ≈ 20,84 %).
  await expect(results).toContainText("20,84");
  // Non-cadre under 1 PMSS: neither CET nor APEC rows appear.
  await expect(results).not.toContainText("CET");
  await expect(results).not.toContainText("APEC");

  // Toggling cadre re-runs the engine and lowers the net (APEC added).
  await page.getByLabel("Statut cadre").check();
  await expect(results).toContainText(/2.374,07/);
  await expect(results).toContainText("APEC");
});

test("parcours micro-entrepreneur : 10 000 € CA prestations BIC → 7 880,00 € net", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "Micro-entrepreneur" }).click();

  await page.getByLabel("Chiffre d'affaires encaissé").fill("10000");

  const results = page.getByTestId("micro-results");
  await expect(results).toBeVisible();
  // Default activity = prestations de services BIC at 21,2 %.
  await expect(results).toContainText(/2.120,00/); // cotisations sociales
  await expect(results).toContainText(/7.880,00/); // net après cotisations
});
