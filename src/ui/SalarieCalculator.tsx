import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { SalarieResult } from "../lib";
import { useLocale } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";
import {
  parseAmount,
  parsePercent,
  type AmountParseResult,
  type PercentParseResult,
} from "./number-format";
import { resolveSalarie, type SalarieDirection, type SalarieForm } from "./salarie-controller";
import { SALARIE_DIRECTION_LABEL_KEYS, SALARIE_DIRECTIONS } from "./labels";
import { AmountField, SegmentedControl, Toggle } from "./fields";
import type { SegmentedOption } from "./fields";
import { SalarieResults } from "./SalarieResults";

/** Maps an amount parse failure to a user-facing message key (empty = no error shown). */
function amountErrorKey(parse: AmountParseResult): MessageKey | null {
  if (parse.ok || parse.reason === "empty") return null;
  return parse.reason === "negative" ? "error.negative" : "error.invalidAmount";
}

/** Maps a percent parse failure to a user-facing message key. */
function percentErrorKey(parse: PercentParseResult): MessageKey | null {
  if (parse.ok || parse.reason === "empty") return null;
  return "error.invalidRate";
}

/** Employee gross-to-net calculator: inputs on the left, live breakdown on the right. */
export function SalarieCalculator(): ReactElement {
  const { t } = useLocale();

  const [direction, setDirection] = useState<SalarieDirection>("brut");
  const [amountRaw, setAmountRaw] = useState("");
  const [cadre, setCadre] = useState(false);
  const [alsaceMoselle, setAlsaceMoselle] = useState(false);
  const [mutuelleRaw, setMutuelleRaw] = useState("");
  const [pasRaw, setPasRaw] = useState("");

  const amountParse = parseAmount(amountRaw);
  const mutuelleParse = parseAmount(mutuelleRaw);
  const pasParse = parsePercent(pasRaw);

  const amountError = amountErrorKey(amountParse);
  const mutuelleError = amountErrorKey(mutuelleParse);
  const pasError = percentErrorKey(pasParse);

  // Pre-resolve to primitives so the memo dependency list stays stable and lint-clean.
  const amountValue = amountParse.ok ? amountParse.value : null;
  const mutuelleValue = mutuelleParse.ok ? mutuelleParse.value : null;
  const pasValue = pasParse.ok ? pasParse.value : null;

  const directionOptions: SegmentedOption<SalarieDirection>[] = SALARIE_DIRECTIONS.map((value) => ({
    value,
    label: t(SALARIE_DIRECTION_LABEL_KEYS[value]),
  }));

  const result = useMemo<SalarieResult | null>(() => {
    if (amountValue === null || mutuelleError !== null || pasError !== null) return null;

    const form: SalarieForm = {
      direction,
      amount: amountValue,
      cadre,
      alsaceMoselle,
      mutuellePatronale: mutuelleValue,
      tauxPAS: pasValue,
    };
    return resolveSalarie(form);
  }, [amountValue, direction, cadre, alsaceMoselle, mutuelleValue, pasValue, mutuelleError, pasError]);

  function reset(): void {
    setDirection("brut");
    setAmountRaw("");
    setCadre(false);
    setAlsaceMoselle(false);
    setMutuelleRaw("");
    setPasRaw("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <SegmentedControl
          legend={t("salarie.direction.label")}
          options={directionOptions}
          value={direction}
          onChange={setDirection}
        />

        <AmountField
          label={t("salarie.amount.label")}
          value={amountRaw}
          onChange={setAmountRaw}
          suffix="€"
          placeholder={t("salarie.amount.placeholder")}
          error={amountError === null ? undefined : t(amountError)}
        />

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-txt">{t("salarie.status.title")}</p>
          <Toggle
            label={t("salarie.cadre.label")}
            hint={t("salarie.cadre.hint")}
            checked={cadre}
            onChange={setCadre}
          />
          <Toggle
            label={t("salarie.alsace.label")}
            hint={t("salarie.alsace.hint")}
            checked={alsaceMoselle}
            onChange={setAlsaceMoselle}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-line bg-panel-2/40 p-3.5">
          <div>
            <p className="text-[13px] font-semibold text-txt">{t("salarie.options.title")}</p>
            <p className="text-[11.5px] text-faint">{t("salarie.options.subtitle")}</p>
          </div>
          <AmountField
            label={t("salarie.mutuelle.label")}
            value={mutuelleRaw}
            onChange={setMutuelleRaw}
            suffix="€"
            optionalLabel={t("common.optional")}
            hint={t("salarie.mutuelle.hint")}
            error={mutuelleError === null ? undefined : t(mutuelleError)}
          />
          <AmountField
            label={t("salarie.pas.label")}
            value={pasRaw}
            onChange={setPasRaw}
            suffix="%"
            optionalLabel={t("common.optional")}
            hint={t("salarie.pas.hint")}
            error={pasError === null ? undefined : t(pasError)}
          />
        </div>

        <button
          type="button"
          onClick={reset}
          className="self-start rounded-lg border border-line-strong px-3.5 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-faint hover:text-txt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          {t("salarie.reset")}
        </button>
      </form>

      <div>
        {result === null ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-panel-2/40 p-6 text-center text-[13.5px] text-muted">
            {t("result.empty")}
          </p>
        ) : (
          <SalarieResults result={result} />
        )}
      </div>
    </div>
  );
}
