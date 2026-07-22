import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { PortageCalculator } from "./PortageCalculator";

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fr-FR"]);
});
afterEach(() => {
  vi.restoreAllMocks();
});

function renderCalculator(): void {
  render(
    <LocaleProvider>
      <PortageCalculator />
    </LocaleProvider>,
  );
}

function normalized(element: HTMLElement): string {
  return element.textContent.replace(/\s/g, " ");
}

describe("PortageCalculator", () => {
  it("shows the empty prompt before any input", () => {
    renderCalculator();
    expect(
      screen.getByText("Saisissez un chiffre d'affaires HT pour lancer l'estimation."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("portage-results")).not.toBeInTheDocument();
  });

  it("estimates the central net and the indicative range", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires HT facturé"), "5000");

    const results = screen.getByTestId("portage-results");
    const text = normalized(results);
    // 5 000 € HT → central 2 500 €, band 2 250–2 750 €.
    expect(text).toContain("2 500,00");
    expect(text).toContain("2 250,00");
    expect(text).toContain("2 750,00");
  });

  it("surfaces a French error on an invalid turnover", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires HT facturé"), "-5");
    expect(screen.getByRole("alert")).toHaveTextContent("Le montant doit être positif.");
    expect(screen.queryByTestId("portage-results")).not.toBeInTheDocument();
  });
});
