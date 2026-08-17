"use client";

import type { TeeColor } from "@/lib/products";

function isLight(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

export default function ColorSwatches({
  colors,
  value,
  onChange,
  size = "md",
}: {
  colors: TeeColor[];
  value: string;
  onChange: (name: string) => void;
  size?: "sm" | "md";
}) {
  if (colors.length === 0) return null;
  const dim = size === "sm" ? "h-4 w-4" : "h-7 w-7";

  return (
    <div className="flex items-center gap-2">
      {colors.map((c) => {
        const selected = c.name === value;
        return (
          <button
            key={c.name}
            type="button"
            title={c.name}
            aria-label={c.name}
            aria-pressed={selected}
            onClick={(e) => {
              e.preventDefault();
              onChange(c.name);
            }}
            className={`${dim} shrink-0 rounded-full transition ${
              selected
                ? "ring-2 ring-brand-blue ring-offset-2"
                : "ring-1 ring-black/10 hover:ring-brand-grey"
            }`}
            style={{
              backgroundColor: c.hex,
              boxShadow: isLight(c.hex) ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
