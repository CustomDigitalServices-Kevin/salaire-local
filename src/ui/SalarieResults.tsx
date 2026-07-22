import type { ReactElement } from "react";
import type { SalarieResult } from "../lib";
import { useLocale } from "../i18n/locale-context";
import { formatEuros, formatPercent } from "./number-format";
import { COTISATION_LABEL_KEYS } from "./labels";

interface SalarieResultsProps {
  result: SalarieResult;
}

/** Renders the employee gross-to-net breakdown: headline net, key figures, and the per-contribution table. */
export function SalarieResults({ result }: SalarieResultsProps): ReactElement {
  const { t, locale } = useLocale();

  const secondaryFigures: { label: string; hint?: string; value: number }[] = [
    { label: t("result.brut"), value: result.brut },
    { label: t("result.totalCotisations"), value: result.totalCotisations },
    {
      label: t("result.netImposable"),
      hint: t("result.netImposable.hint"),
      value: result.netImposable,
    },
  ];
  if (result.impotPAS !== null) {
    secondaryFigures.push({ label: t("result.impotPAS"), value: result.impotPAS });
  }
  if (result.netApresImpot !== null) {
    secondaryFigures.push({ label: t("result.netApresImpot"), value: result.netApresImpot });
  }

  return (
    <div className="flex flex-col gap-5" data-testid="salarie-results" aria-live="polite">
      <div className="rounded-2xl border border-orange/30 bg-orange-soft p-5">
        <p className="text-[12.5px] font-semibold tracking-wide text-orange-light uppercase">
          {t("result.netAPayer")}
        </p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight text-txt">
          {formatEuros(result.netAPayer, locale)}
        </p>
        <p className="mt-1 text-[12.5px] text-muted">
          {t("result.netAPayer.hint")} {t("common.approx")}{" "}
          {formatEuros(result.netAPayer * 12, locale)} {t("common.perYear")}.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {secondaryFigures.map((figure) => (
          <div key={figure.label} className="rounded-xl border border-line bg-panel-2 p-3.5">
            <p className="text-[12px] text-muted">{figure.label}</p>
            <p className="mt-0.5 text-lg font-bold text-txt">{formatEuros(figure.value, locale)}</p>
            {figure.hint !== undefined && (
              <p className="mt-0.5 text-[11px] text-faint">{figure.hint}</p>
            )}
          </div>
        ))}
        <div className="rounded-xl border border-line bg-panel-2 p-3.5">
          <p className="text-[12px] text-muted">{t("result.tauxGlobal")}</p>
          <p className="mt-0.5 text-lg font-bold text-orange">
            {formatPercent(result.tauxGlobalCharges, locale)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[13.5px] font-bold text-txt">{t("result.detailTitle")}</h3>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[26rem] text-left text-[12.5px]">
            <thead className="bg-panel-2 text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t("result.column.cotisation")}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t("result.column.base")}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t("result.column.rate")}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t("result.column.amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.cotisations.map((line) => (
                <tr key={line.key} className="border-t border-line">
                  <td className="px-3 py-2 text-txt">{t(COTISATION_LABEL_KEYS[line.key])}</td>
                  <td className="px-3 py-2 text-right text-muted tabular-nums">
                    {formatEuros(line.assiette, locale)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted tabular-nums">
                    {formatPercent(line.taux, locale)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-txt tabular-nums">
                    {formatEuros(line.montant, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line-strong bg-panel-2">
                <td className="px-3 py-2 font-bold text-txt" colSpan={3}>
                  {t("result.totalCotisations")}
                </td>
                <td className="px-3 py-2 text-right font-bold text-txt tabular-nums">
                  {formatEuros(result.totalCotisations, locale)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
