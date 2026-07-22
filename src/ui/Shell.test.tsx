import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";

describe("Shell", () => {
  it("renders the local-first banner", () => {
    render(<App />);
    expect(screen.getByTestId("local-banner")).toBeInTheDocument();
  });

  it("switches locale between FR and EN", async () => {
    const user = userEvent.setup();
    render(<App />);
    const initialTitle = screen.getByRole("heading", { level: 1 }).textContent;
    await user.click(screen.getByTestId("locale-toggle"));
    const toggledTitle = screen.getByRole("heading", { level: 1 }).textContent;
    expect(toggledTitle).not.toBe(initialTitle);
    expect(["Salaire brut / net France 2026", "Gross / Net Salary France 2026"]).toContain(
      toggledTitle,
    );
  });

  it("navigates to the privacy page and back", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Privacy & GDPR" }));
    expect(screen.getByRole("heading", { level: 1, name: "Privacy & GDPR" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to home" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Gross / Net Salary France 2026" }),
    ).toBeInTheDocument();
  });

  it("navigates to the licenses page and lists runtime dependencies", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Third-party licenses" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Third-party licenses" }),
    ).toBeInTheDocument();
    expect(screen.getByText("react / react-dom")).toBeInTheDocument();
    expect(screen.getAllByText("MIT").length).toBeGreaterThan(0);
  });

  it("lists the calculation assumptions on the home page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Calculation assumptions" })).toBeInTheDocument();
    // The urssaf link appears in both the calculator footer and the assumptions
    // panel; every occurrence must point at the official site.
    const links = screen.getAllByRole("link", { name: "Check on urssaf.fr" });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "https://www.urssaf.fr");
    }
  });

  it("mounts the simulator with its three modes and an empty-result prompt", () => {
    render(<App />);
    expect(screen.getByRole("tab", { name: "Employee" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Micro-entrepreneur" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Umbrella company" })).toBeInTheDocument();
    expect(screen.getByText("Enter an amount to run the calculation.")).toBeInTheDocument();
  });
});
