"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { getTeeBySlug } from "@/lib/products";
import ProductImage from "./product-image";

export default function CompareBar() {
  const { slugs, remove, clear } = useCompare();
  const pathname = usePathname();

  if (slugs.length === 0 || pathname === "/compare") return null;

  const tees = slugs
    .map((s) => getTeeBySlug(s))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-silver bg-white shadow-[0_-4px_16px_rgba(11,31,58,0.08)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {tees.map((tee) => (
            <div key={tee.slug} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-brand-silver/30">
              <ProductImage slug={tee.slug} alt={tee.model} brand={tee.brand} category={tee.category} sizes="48px" />
              <button
                type="button"
                onClick={() => remove(tee.slug)}
                aria-label={`Remove ${tee.brand} ${tee.model} from compare`}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-navy text-[9px] text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-brand-grey">
          {tees.length} of 4 tees selected
        </p>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-brand-grey hover:text-red-600"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-md bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-navy"
          >
            Compare {tees.length > 1 ? `(${tees.length})` : ""}
          </Link>
        </div>
      </div>
    </div>
  );
}
