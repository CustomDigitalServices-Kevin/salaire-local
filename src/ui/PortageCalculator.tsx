import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { computePortage, type PortageResult } from "../lib";
import { useLocale } from "../i18n/locale-context";
import { formatEuros, parseAmount } from "./number-format";
import { AmountField } from "./fields";

/** Portage salarial indicative estimate: net lands around 50% of billed turnover excl. VAT. */
export function PortageCalculator(): ReactElement {
  const { t, locale } = useLocale();

  const [caRaw, setCaRaw] = useState("");
  const caParse = parseAmount(caRaw);
  const caError =
    caParse.ok || caParse.reason === "empty"
      ? null
      : caParse.reason === "negative"
        ? "error.negative"
        : "error.invalidAmount";

  const caValue = caParse.ok ? caParse.value : null;

  const result = useMemo<PortageResult | null>(() => {
    if (caValue === null) return null;
    return computePortage({ caHT: caValue });
  }, [caValue]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <AmountField
          label={t("portage.ca.label")}
          value={caRaw}
          onChange={setCaRaw}
          suffix="€"
          placeholder={t("portage.ca.placeholder")}
          error={caError === null ? undefined : t(caError)}
        />
        <p className="text-[11.5px] text-faint">{t("portage.note")}</p>
      </form>

      <div>
        {result === null ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-panel-2/40 p-6 text-center text-[13.5px] text-muted">
            {t("portage.empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-4" data-testid="portage-results" aria-live="polite">
            <div className="rounded-2xl border border-orange/30 bg-orange-soft p-5">
              <p className="text-[12.5px] font-semibold tracking-wide text-orange-light uppercase">
                {t("portage.result.net")}
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-txt">
                {formatEuros(result.netEstime, locale)}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-panel-2 p-3.5">
              <p className="text-[12px] text-muted">{t("portage.result.range")}</p>
              <p className="mt-0.5 text-lg font-bold text-txt tabular-nums">
                {formatEuros(result.fourchetteBasse, locale)} –{" "}
                {formatEuros(result.fourchetteHaute, locale)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
