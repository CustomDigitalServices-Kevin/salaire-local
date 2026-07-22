import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { SalarieCalculator } from "./SalarieCalculator";

// Force the French locale so label/currency assertions are deterministic.
beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fr-FR"]);
});
afterEach(() => {
  vi.restoreAllMocks();
});

function renderCalculator(): void {
  render(
    <LocaleProvider>
      <SalarieCalculator />
    </LocaleProvider>,
  );
}

describe("SalarieCalculator", () => {
  it("shows the empty prompt before any input", () => {
    renderCalculator();
    expect(screen.getByText("Saisissez un montant pour lancer le calcul.")).toBeInTheDocument();
    expect(screen.queryByTestId("salarie-results")).not.toBeInTheDocument();
  });

  it("computes and displays the net from a gross amount", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Montant mensuel"), "3000");

    const results = screen.getByTestId("salarie-results");
    expect(results).toBeInTheDocument();
    // The headline net à payer for a 3000 € gross non-cadre lands around 2 340 €.
    expect(within(results).getByText("Net à payer")).toBeInTheDocument();
    expect(within(results).getByText("CSG déductible")).toBeInTheDocument();
  });

  it("adds the APEC line when cadre status is enabled", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Montant mensuel"), "3000");
    expect(screen.queryByText("APEC (cadres)")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /Statut cadre/ }));
    expect(screen.getByText("APEC (cadres)")).toBeInTheDocument();
  });

  it("computes a gross from a net-pay target when the direction is switched", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.click(screen.getByRole("button", { name: "Net à payer" }));
    await user.type(screen.getByLabelText("Montant mensuel"), "2340");

    const results = screen.getByTestId("salarie-results");
    // Inverting a net-pay target still produces a full breakdown incl. the gross.
    expect(within(results).getByText("Salaire brut mensuel")).toBeInTheDocument();
    expect(within(results).getByText("CSG déductible")).toBeInTheDocument();
  });

  it("surfaces a French error on an invalid amount", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Montant mensuel"), "abc");
    expect(screen.getByRole("alert")).toHaveTextContent("Saisissez un montant valide.");
    expect(screen.queryByTestId("salarie-results")).not.toBeInTheDocument();
  });

  it("rejects an out-of-range withholding rate", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Montant mensuel"), "3000");
    await user.type(screen.getByLabelText(/Taux de prélèvement à la source/), "150");
    expect(screen.getByRole("alert")).toHaveTextContent("Le taux doit être compris entre 0 et 100.");
    expect(screen.queryByTestId("salarie-results")).not.toBeInTheDocument();
  });

  it("resets every field back to the empty state", async () => {
    const user = userEvent.setup();
    renderCalculator();
    await user.type(screen.getByLabelText("Montant mensuel"), "3000");
    expect(screen.getByTestId("salarie-results")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Réinitialiser" }));
    expect(screen.queryByTestId("salarie-results")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Montant mensuel")).toHaveValue("");
  });
});
