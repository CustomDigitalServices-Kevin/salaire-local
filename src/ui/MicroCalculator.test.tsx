import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { MicroCalculator } from "./MicroCalculator";

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fr-FR"]);
});
afterEach(() => {
  vi.restoreAllMocks();
});

function renderCalculator(): void {
  render(
    <LocaleProvider>
      <MicroCalculator />
    </LocaleProvider>,
  );
}

function normalized(element: HTMLElement): string {
  return element.textContent.replace(/\s/g, " ");
}

describe("MicroCalculator", () => {
  it("shows the empty prompt before any input", () => {
    renderCalculator();
    expect(screen.getByText("Saisissez un chiffre d'affaires pour lancer l'estimation.")).toBeInTheDocument();
    expect(screen.queryByTestId("micro-results")).not.toBeInTheDocument();
  });

  it("estimates contributions for a services turnover (21.2%)", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "10000");

    const results = screen.getByTestId("micro-results");
    // 10 000 € services → 2 120 € contributions, 7 880 € net.
    expect(normalized(results)).toContain("2 120,00");
    expect(normalized(results)).toContain("7 880,00");
    expect(within(results).getByText("21,2 %")).toBeInTheDocument();
  });

  it("shows the re-verify warning for the volatile liberal BNC rate", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "10000");
    expect(screen.queryByRole("note")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("Activité"),
      "liberal_general_bnc",
    );
    expect(screen.getByRole("note")).toHaveTextContent("Taux volatil, à revérifier sur urssaf.fr.");
  });

  it("defaults to the published ACRE rate for creations on or after 1 July 2026", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "10000");
    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));

    const results = screen.getByTestId("micro-results");
    expect(within(results).getByText("15,9 %")).toBeInTheDocument();
    expect(normalized(results)).toContain("1 590,00");
    expect(normalized(results)).toContain("8 410,00");
    expect(screen.getByRole("button", { name: "À partir du 1er juillet 2026" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Avant le 1er juillet 2026" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Création ou reprise à partir du 1er juillet 2026. Taux ACRE de votre activité : 15,9 %.")).toBeInTheDocument();
  });

  it("switches between creation periods and restores the full rate when ACRE is disabled", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "10000");
    expect(screen.queryByRole("group", { name: "Date de création ou de reprise" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));

    const periods = screen.getByRole("group", { name: "Date de création ou de reprise" });
    expect(within(periods).getAllByRole("button")).toHaveLength(2);
    expect(within(periods).queryByRole("combobox")).not.toBeInTheDocument();
    await user.click(within(periods).getByRole("button", { name: "Avant le 1er juillet 2026" }));

    const results = screen.getByTestId("micro-results");
    expect(within(results).getByText("10,6 %")).toBeInTheDocument();
    expect(normalized(results)).toContain("1 060,00");
    expect(normalized(results)).toContain("8 940,00");
    expect(screen.getByRole("button", { name: "Avant le 1er juillet 2026" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Création ou reprise avant le 1er juillet 2026. Taux ACRE de votre activité : 10,6 %.")).toBeInTheDocument();

    await user.click(within(periods).getByRole("button", { name: "À partir du 1er juillet 2026" }));
    expect(within(results).getByText("15,9 %")).toBeInTheDocument();
    expect(screen.queryByText("Création ou reprise avant le 1er juillet 2026. Taux ACRE de votre activité : 10,6 %.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));
    expect(within(results).getByText("21,2 %")).toBeInTheDocument();
    expect(normalized(results)).toContain("2 120,00");
    expect(screen.queryByRole("group", { name: "Date de création ou de reprise" })).not.toBeInTheDocument();
  });

  it("focuses and activates both creation-period buttons from the keyboard", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.tab();
    expect(screen.getByLabelText("Chiffre d'affaires encaissé")).toHaveFocus();
    await user.keyboard("10000");
    await user.tab();
    expect(screen.getByLabelText("Activité")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("checkbox", { name: /ACRE/ })).toHaveFocus();
    await user.keyboard(" ");

    const periods = screen.getByRole("group", { name: "Date de création ou de reprise" });
    const before = within(periods).getByRole("button", { name: "Avant le 1er juillet 2026" });
    const since = within(periods).getByRole("button", { name: "À partir du 1er juillet 2026" });
    const results = screen.getByTestId("micro-results");
    expect(before).toHaveAttribute("aria-pressed", "false");
    expect(since).toHaveAttribute("aria-pressed", "true");

    await user.tab();
    expect(before).toHaveFocus();
    await user.keyboard(" ");
    expect(before).toHaveFocus();
    expect(before).toHaveAttribute("aria-pressed", "true");
    expect(since).toHaveAttribute("aria-pressed", "false");
    expect(within(results).getByText("10,6 %")).toBeInTheDocument();

    await user.tab();
    expect(since).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(since).toHaveFocus();
    expect(since).toHaveAttribute("aria-pressed", "true");
    expect(before).toHaveAttribute("aria-pressed", "false");
    expect(within(results).getByText("15,9 %")).toBeInTheDocument();
  });

  it.each([
    {
      language: "fr-FR",
      turnoverLabel: "Chiffre d'affaires encaissé",
      activityLabel: "Activité",
      beforeLabel: "Avant le 1er juillet 2026",
      sinceLabel: "À partir du 1er juillet 2026",
      beforeHint: "Création ou reprise avant le 1er juillet 2026. Taux ACRE de votre activité :",
      sinceHint: "Création ou reprise à partir du 1er juillet 2026. Taux ACRE de votre activité :",
      sourceLabel: "Source : Urssaf, taux ACRE par activité",
      rates: [
        { activity: "vente_marchandises_bic", before: "6,2 %", since: "9,3 %", beforeAmount: "620,00", sinceAmount: "930,00" },
        { activity: "prestations_services_bic", before: "10,6 %", since: "15,9 %", beforeAmount: "1 060,00", sinceAmount: "1 590,00" },
        { activity: "liberal_general_bnc", before: "12,8 %", since: "19,2 %", beforeAmount: "1 280,00", sinceAmount: "1 920,00" },
        { activity: "liberal_cipav_bnc", before: "13,4 %", since: "17,4 %", beforeAmount: "1 340,00", sinceAmount: "1 740,00" },
      ],
    },
    {
      language: "en-GB",
      turnoverLabel: "Cashed-in turnover",
      activityLabel: "Activity",
      beforeLabel: "Before 1 July 2026",
      sinceLabel: "On or after 1 July 2026",
      beforeHint: "Creation or takeover before 1 July 2026. ACRE rate for your activity:",
      sinceHint: "Creation or takeover on or after 1 July 2026. ACRE rate for your activity:",
      sourceLabel: "Source: Urssaf, ACRE rates by activity",
      rates: [
        { activity: "vente_marchandises_bic", before: "6.2%", since: "9.3%", beforeAmount: "620.00", sinceAmount: "930.00" },
        { activity: "prestations_services_bic", before: "10.6%", since: "15.9%", beforeAmount: "1,060.00", sinceAmount: "1,590.00" },
        { activity: "liberal_general_bnc", before: "12.8%", since: "19.2%", beforeAmount: "1,280.00", sinceAmount: "1,920.00" },
        { activity: "liberal_cipav_bnc", before: "13.4%", since: "17.4%", beforeAmount: "1,340.00", sinceAmount: "1,740.00" },
      ],
    },
  ])("displays the published rates and matching sources for all activities in $language", async ({ language, turnoverLabel, activityLabel, beforeLabel, sinceLabel, beforeHint, sinceHint, sourceLabel, rates }) => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue([language]);
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText(turnoverLabel), "10000");
    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));

    expect(screen.getByRole("button", { name: sinceLabel })).toHaveAttribute("aria-pressed", "true");
    for (const rate of rates) {
      await user.selectOptions(screen.getByLabelText(activityLabel), rate.activity);
      const results = screen.getByTestId("micro-results");

      expect(screen.getByText(`${sinceHint} ${rate.since}.`)).toBeInTheDocument();
      expect(within(results).getByText(rate.since)).toBeInTheDocument();
      expect(normalized(results)).toContain(rate.sinceAmount);
      expect(screen.getByRole("link", { name: sourceLabel })).toHaveAttribute("href", "https://www.urssaf.fr/files/live/sites/urssaffr/files/autres/Diaporama_Auto-entrepreneur.pdf#page=17");

      await user.click(screen.getByRole("button", { name: beforeLabel }));
      expect(screen.getByText(`${beforeHint} ${rate.before}.`)).toBeInTheDocument();
      expect(within(results).getByText(rate.before)).toBeInTheDocument();
      expect(normalized(results)).toContain(rate.beforeAmount);
      expect(screen.getByRole("link", { name: sourceLabel })).toHaveAttribute("href", "https://www.urssaf.fr/files/live/sites/urssaffr/files/autres/Diaporama_Auto-entrepreneur.pdf#page=16");

      await user.click(screen.getByRole("button", { name: sinceLabel }));
    }
  });

  it.each([
    {
      language: "fr-FR",
      turnoverLabel: "Chiffre d'affaires encaissé",
      beforeLabel: "Avant le 1er juillet 2026",
      sinceLabel: "À partir du 1er juillet 2026",
      duration: "Taux réduit jusqu'à la fin du 3e trimestre civil qui suit le début d'activité.",
      scope: "Le simulateur ne proratise pas : le résultat suppose que tout le chiffre d'affaires saisi relève de la période à taux réduit.",
    },
    {
      language: "en-GB",
      turnoverLabel: "Cashed-in turnover",
      beforeLabel: "Before 1 July 2026",
      sinceLabel: "On or after 1 July 2026",
      duration: "Reduced rate until the end of the third calendar quarter after the business starts.",
      scope: "The simulator does not prorate: the result assumes all entered turnover falls within the reduced-rate period.",
    },
  ])("shows the ACRE duration and turnover scope only while enabled in both periods in $language", async ({ language, turnoverLabel, beforeLabel, sinceLabel, duration, scope }) => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue([language]);
    const user = userEvent.setup();
    renderCalculator();
    expect(screen.queryByText(duration)).not.toBeInTheDocument();
    expect(screen.queryByText(scope)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(turnoverLabel), "10000");
    const acreCheckbox = screen.getByRole("checkbox", { name: /ACRE/ });
    for (const periodLabel of [sinceLabel, beforeLabel]) {
      await user.click(acreCheckbox);
      const periodButton = screen.getByRole("button", { name: periodLabel });
      await user.click(periodButton);
      expect(periodButton).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText(duration)).toBeInTheDocument();
      expect(screen.getByText(scope)).toBeInTheDocument();

      await user.click(acreCheckbox);
      expect(screen.queryByText(duration)).not.toBeInTheDocument();
      expect(screen.queryByText(scope)).not.toBeInTheDocument();
    }
  });

  it("surfaces a French error on an invalid turnover", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "xx");
    expect(screen.getByRole("alert")).toHaveTextContent("Saisissez un montant valide.");
    expect(screen.queryByTestId("micro-results")).not.toBeInTheDocument();
  });
});
