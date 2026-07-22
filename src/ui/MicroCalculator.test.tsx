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

  it("halves the rate when ACRE is enabled", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "10000");
    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));

    const results = screen.getByTestId("micro-results");
    // 21.2% halved → 10.6% → 1 060 € contributions.
    expect(within(results).getByText("10,6 %")).toBeInTheDocument();
    expect(normalized(results)).toContain("1 060,00");
  });

  it("surfaces a French error on an invalid turnover", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "xx");
    expect(screen.getByRole("alert")).toHaveTextContent("Saisissez un montant valide.");
    expect(screen.queryByTestId("micro-results")).not.toBeInTheDocument();
  });
});
