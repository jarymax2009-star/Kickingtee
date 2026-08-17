"use client";

import { useState } from "react";
import {
  BASE_BAND_OPTIONS,
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CODE_OPTIONS,
  EMPTY_FILTERS,
  GRIP_OPTIONS,
  MATERIAL_OPTIONS,
  MECHANISM_OPTIONS,
  PRICE_BAND_OPTIONS,
  WEIGHT_BAND_OPTIONS,
  type FilterState,
} from "@/lib/filters";

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-silver py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-display text-xs font-bold uppercase tracking-wide text-brand-navy">
          {title}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-brand-grey transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy/85">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-brand-silver text-brand-blue accent-brand-blue"
      />
      {label}
    </label>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-brand-navy">
          Filters
        </h2>
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="pb-4">
        <input
          type="search"
          placeholder="Search brand or model…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-md border border-brand-silver px-3 py-2 text-sm text-brand-navy placeholder:text-brand-grey focus:border-brand-blue focus:outline-none"
        />
      </div>

      <Section title="Use case">
        {CODE_OPTIONS.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={filters.codes.includes(c)}
            onChange={() => set("codes", toggle(filters.codes, c))}
          />
        ))}
      </Section>

      <Section title="Brand">
        {BRAND_OPTIONS.map((b) => (
          <Checkbox
            key={b}
            label={b}
            checked={filters.brands.includes(b)}
            onChange={() => set("brands", toggle(filters.brands, b))}
          />
        ))}
      </Section>

      <Section title="Style / cut" defaultOpen={false}>
        {CATEGORY_OPTIONS.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onChange={() => set("categories", toggle(filters.categories, c))}
          />
        ))}
      </Section>

      <Section title="Adjustment mechanism" defaultOpen={false}>
        {MECHANISM_OPTIONS.map((m) => (
          <Checkbox
            key={m}
            label={m}
            checked={filters.mechanisms.includes(m)}
            onChange={() => set("mechanisms", toggle(filters.mechanisms, m))}
          />
        ))}
      </Section>

      <Section title="Price" defaultOpen>
        {PRICE_BAND_OPTIONS.map((p) => (
          <Checkbox
            key={p.value}
            label={p.label}
            checked={filters.priceBands.includes(p.value)}
            onChange={() => set("priceBands", toggle(filters.priceBands, p.value))}
          />
        ))}
      </Section>

      <Section title="Base width" defaultOpen={false}>
        {BASE_BAND_OPTIONS.map((b) => (
          <Checkbox
            key={b}
            label={b}
            checked={filters.baseBands.includes(b)}
            onChange={() => set("baseBands", toggle(filters.baseBands, b))}
          />
        ))}
      </Section>

      <Section title="Weight" defaultOpen={false}>
        {WEIGHT_BAND_OPTIONS.map((w) => (
          <Checkbox
            key={w}
            label={w}
            checked={filters.weightBands.includes(w)}
            onChange={() => set("weightBands", toggle(filters.weightBands, w))}
          />
        ))}
      </Section>

      <Section title="Material" defaultOpen={false}>
        {MATERIAL_OPTIONS.map((m) => (
          <Checkbox
            key={m}
            label={m}
            checked={filters.materialFamilies.includes(m)}
            onChange={() => set("materialFamilies", toggle(filters.materialFamilies, m))}
          />
        ))}
      </Section>

      <Section title="Grip / base type" defaultOpen={false}>
        {GRIP_OPTIONS.map((g) => (
          <Checkbox
            key={g}
            label={g}
            checked={filters.gripFamilies.includes(g)}
            onChange={() => set("gripFamilies", toggle(filters.gripFamilies, g))}
          />
        ))}
      </Section>

      <div className="py-4">
        <Checkbox
          label="Pro / coach endorsed only"
          checked={filters.endorsedOnly}
          onChange={() => set("endorsedOnly", !filters.endorsedOnly)}
        />
      </div>

      <div className="rounded-lg bg-brand-silver/40 p-3 text-xs leading-relaxed text-brand-grey">
        <strong className="text-brand-navy">Wind &amp; wet-pitch ratings:</strong>{" "}
        we&apos;re independently field-testing every tee — ratings will appear
        here as testing completes.
      </div>
    </div>
  );
}
