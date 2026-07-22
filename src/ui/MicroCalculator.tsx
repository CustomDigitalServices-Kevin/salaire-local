import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { computeMicro, type MicroActivite, type MicroResult } from "../lib";
import { useLocale } from "../i18n/locale-context";
import { formatEuros, formatPercent, parseAmount } from "./number-format";
import { MICRO_ACTIVITE_LABEL_KEYS, MICRO_ACTIVITES } from "./labels";
import { AmountField, SelectField, Toggle } from "./fields";
import type { SegmentedOption } from "./fields";

/** Micro-entrepreneur social-contribution estimate: turnover × forfaitaire rate by activity. */
export function MicroCalculator(): ReactElement {
  const { t, locale } = useLocale();

  const [caRaw, setCaRaw] = useState("");
  const [activite, setActivite] = useState<MicroActivite>("prestations_services_bic");
  const [acre, setAcre] = useState(false);

  const caParse = parseAmount(caRaw);
  const caError =
    caParse.ok || caParse.reason === "empty"
      ? null
      : caParse.reason === "negative"
        ? "error.negative"
        : "error.invalidAmount";

  const caValue = caParse.ok ? caParse.value : null;

  const activiteOptions: SegmentedOption<MicroActivite>[] = MICRO_ACTIVITES.map((value) => ({
    value,
    label: t(MICRO_ACTIVITE_LABEL_KEYS[value]),
  }));

  const result = useMemo<MicroResult | null>(() => {
    if (caValue === null) return null;
    return computeMicro({ caEncaisse: caValue, activite, acre });
  }, [caValue, activite, acre]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <AmountField
          label={t("micro.ca.label")}
          value={caRaw}
          onChange={setCaRaw}
          suffix="€"
          placeholder={t("micro.ca.placeholder")}
          error={caError === null ? undefined : t(caError)}
        />
        <SelectField
          label={t("micro.activite.label")}
          options={activiteOptions}
          value={activite}
          onChange={setActivite}
        />
        <Toggle
          label={t("micro.acre.label")}
          hint={t("micro.acre.hint")}
          checked={acre}
          onChange={setAcre}
        />
        <p className="text-[11.5px] text-faint">{t("micro.note")}</p>
      </form>

      <div>
        {result === null ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-panel-2/40 p-6 text-center text-[13.5px] text-muted">
            {t("micro.empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-4" data-testid="micro-results" aria-live="polite">
            <div className="rounded-2xl border border-orange/30 bg-orange-soft p-5">
              <p className="text-[12.5px] font-semibold tracking-wide text-orange-light uppercase">
                {t("micro.result.net")}
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-txt">
                {formatEuros(result.net, locale)}
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-panel-2 p-3.5">
                <p className="text-[12px] text-muted">{t("micro.result.cotisations")}</p>
                <p className="mt-0.5 text-lg font-bold text-txt">
                  {formatEuros(result.cotisations, locale)}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel-2 p-3.5">
                <p className="text-[12px] text-muted">{t("micro.result.taux")}</p>
                <p className="mt-0.5 text-lg font-bold text-orange">
                  {formatPercent(result.taux, locale)}
                </p>
              </div>
            </div>
            {result.aReverifier && (
              <p
                role="note"
                className="rounded-xl border border-red/40 bg-red/8 px-3.5 py-2.5 text-[12px] font-medium text-red"
              >
                {t("micro.result.reverifier")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
