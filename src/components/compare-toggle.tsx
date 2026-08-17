"use client";

import { useCompare, MAX_COMPARE } from "@/lib/compare-context";

export default function CompareToggle({
  slug,
  variant = "card",
}: {
  slug: string;
  variant?: "card" | "detail";
}) {
  const { isComparing, toggle, atLimit } = useCompare();
  const active = isComparing(slug);
  const disabled = !active && atLimit;

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        disabled={disabled}
        title={disabled ? `You can compare up to ${MAX_COMPARE} tees at once` : undefined}
        className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
          active
            ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
            : "border-brand-silver text-brand-navy hover:border-brand-blue hover:text-brand-blue"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <CheckboxIcon checked={active} />
        {active ? "Added to compare" : "Add to compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      disabled={disabled}
      title={
        disabled
          ? `You can compare up to ${MAX_COMPARE} tees at once`
          : active
            ? "Remove from compare"
            : "Add to compare"
      }
      aria-pressed={active}
      className={`absolute bottom-2 right-2 z-10 flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold shadow-sm transition ${
        active
          ? "border-brand-blue bg-brand-blue text-white"
          : "border-brand-silver bg-white/95 text-brand-navy hover:border-brand-blue hover:text-brand-blue"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <CheckboxIcon checked={active} />
      Compare
    </button>
  );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      {checked ? (
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <rect x="4" y="4" width="16" height="16" rx="3" />
      )}
    </svg>
  );
}
