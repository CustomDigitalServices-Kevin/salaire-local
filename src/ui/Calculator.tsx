import { useState } from "react";
import type { ReactElement } from "react";
import { baremes } from "../lib";
import { useLocale } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";
import { formatIsoDate } from "./number-format";
import { SalarieCalculator } from "./SalarieCalculator";
import { MicroCalculator } from "./MicroCalculator";
import { PortageCalculator } from "./PortageCalculator";

type Mode = "salarie" | "micro" | "portage";

const MODES: readonly { id: Mode; labelKey: MessageKey }[] = [
  { id: "salarie", labelKey: "calc.tab.salarie" },
  { id: "micro", labelKey: "calc.tab.micro" },
  { id: "portage", labelKey: "calc.tab.portage" },
];

/** Tabbed simulator: employee / micro-entrepreneur / umbrella, plus the barème vintage footer. */
export function Calculator(): ReactElement {
  const { t, locale } = useLocale();
  const [mode, setMode] = useState<Mode>("salarie");

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label={t("app.title")} className="flex flex-wrap gap-1.5">
        {MODES.map((entry) => {
          const active = entry.id === mode;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(entry.id);
              }}
              className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                active
                  ? "bg-linear-to-br from-orange to-orange-mid text-white"
                  : "border border-line-strong text-muted hover:border-orange hover:text-orange"
              }`}
            >
              {t(entry.labelKey)}
            </button>
          );
        })}
      </div>

      <div>
        {mode === "salarie" && <SalarieCalculator />}
        {mode === "micro" && <MicroCalculator />}
        {mode === "portage" && <PortageCalculator />}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-[11.5px] text-faint">
        <span className="font-semibold text-muted">{t("calc.baremeLabel")}</span>
        <span>{formatIsoDate(baremes.date, locale)}</span>
        <span aria-hidden="true">·</span>
        <span>
          {t("calc.source")} : {baremes.source}
        </span>
        <a
          href="https://www.urssaf.fr"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          {t("hypotheses.verify")}
        </a>
      </div>
    </div>
  );
}
