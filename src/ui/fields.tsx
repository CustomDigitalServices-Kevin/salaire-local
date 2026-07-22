import { useId } from "react";
import type { ReactElement } from "react";

/**
 * Presentational, locale-agnostic form primitives shared by every calculator.
 * All labels/hints are passed in as already-translated strings, so these stay
 * free of i18n coupling and are trivial to reuse.
 */

interface AmountFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Unit shown inside the input (e.g. "€" or "%"). */
  suffix: string;
  // `| undefined` is explicit so callers may pass a computed `x ?? undefined`
  // under `exactOptionalPropertyTypes`.
  placeholder?: string | undefined;
  hint?: string | undefined;
  optionalLabel?: string | undefined;
  /** Already-translated error message; when set the field renders in error. */
  error?: string | undefined;
}

/** A labelled numeric text input with a unit suffix and inline error slot. */
export function AmountField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  hint,
  optionalLabel,
  error,
}: AmountFieldProps): ReactElement {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-[13px] font-semibold text-txt">
        {label}
        {optionalLabel !== undefined && (
          <span className="text-[11.5px] font-normal text-faint">{optionalLabel}</span>
        )}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-panel-2 px-3 transition-colors focus-within:border-orange ${
          error ? "border-red/60" : "border-line-strong"
        }`}
      >
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy === "" ? undefined : describedBy}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className="w-full bg-transparent py-2.5 text-[15px] text-txt outline-none placeholder:text-faint"
        />
        <span aria-hidden="true" className="shrink-0 text-[13px] font-semibold text-muted">
          {suffix}
        </span>
      </div>
      {hint !== undefined && !error && (
        <p id={hintId} className="text-[11.5px] text-faint">
          {hint}
        </p>
      )}
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-[11.5px] font-medium text-red">
          {error}
        </p>
      )}
    </div>
  );
}

interface ToggleProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** An accessible checkbox styled as a labelled option row. */
export function Toggle({ label, hint, checked, onChange }: ToggleProps): ReactElement {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-panel-2 p-3 transition-colors hover:border-line-strong"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        aria-describedby={hint === undefined ? undefined : hintId}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        className="mt-0.5 size-4 shrink-0 accent-orange"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-txt">{label}</span>
        {hint !== undefined && (
          <span id={hintId} className="text-[11.5px] text-faint">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  legend: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A radio group rendered as a segmented pill control. */
export function SegmentedControl<T extends string>({
  legend,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>): ReactElement {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13px] font-semibold text-txt">{legend}</legend>
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-line-strong bg-panel-2 p-1">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                onChange(option.value);
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-[12.5px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                active
                  ? "bg-linear-to-br from-orange to-orange-mid text-white"
                  : "text-muted hover:text-txt"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A labelled native select. */
export function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: SelectFieldProps<T>): ReactElement {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-txt">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value as T);
        }}
        className="rounded-xl border border-line-strong bg-panel-2 px-3 py-2.5 text-[14px] text-txt outline-none transition-colors focus:border-orange"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-panel-2 text-txt">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
