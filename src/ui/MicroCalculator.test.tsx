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

  it("defaults to a 25% ACRE exemption for creations on or after 1 July 2026", async () => {
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
    expect(screen.getByText("Exonération de 25 % : vous payez 75 % du taux plein pendant la période ACRE.")).toBeInTheDocument();
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
    expect(screen.getByText("Exonération de 50 % : vous payez 50 % du taux plein pendant la période ACRE.")).toBeInTheDocument();

    await user.click(within(periods).getByRole("button", { name: "À partir du 1er juillet 2026" }));
    expect(within(results).getByText("15,9 %")).toBeInTheDocument();
    expect(screen.queryByText("Exonération de 50 % : vous payez 50 % du taux plein pendant la période ACRE.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));
    expect(within(results).getByText("21,2 %")).toBeInTheDocument();
    expect(normalized(results)).toContain("2 120,00");
    expect(screen.queryByRole("group", { name: "Date de création ou de reprise" })).not.toBeInTheDocument();
  });

  it("describes both ACRE periods in English", async () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["en-GB"]);
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Cashed-in turnover"), "10000");
    await user.click(screen.getByRole("checkbox", { name: /ACRE/ }));

    expect(screen.getByRole("button", { name: "On or after 1 July 2026" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("25% exemption: you pay 75% of the full rate during the ACRE period.")).toBeInTheDocument();
    expect(within(screen.getByTestId("micro-results")).getByText("15.9%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Before 1 July 2026" }));
    expect(screen.getByText("50% exemption: you pay 50% of the full rate during the ACRE period.")).toBeInTheDocument();
    expect(within(screen.getByTestId("micro-results")).getByText("10.6%")).toBeInTheDocument();
  });

  it("surfaces a French error on an invalid turnover", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Chiffre d'affaires encaissé"), "xx");
    expect(screen.getByRole("alert")).toHaveTextContent("Saisissez un montant valide.");
    expect(screen.queryByTestId("micro-results")).not.toBeInTheDocument();
  });
});
