"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/filter-sidebar";
import ProductCard from "@/components/product-card";
import { activeFilterCount, allTees, applyFilters, EMPTY_FILTERS, type FilterState } from "@/lib/filters";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code");

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...EMPTY_FILTERS,
    codes: initialCode && ["Union", "League", "Both"].includes(initialCode) ? [initialCode] : [],
  }));
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => applyFilters(allTees, filters), [filters]);
  const activeCount = activeFilterCount(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
          Shop rugby kicking tees
        </h1>
        <p className="mt-2 max-w-2xl text-brand-grey">
          {allTees.length} tees from {new Set(allTees.map((t) => t.brand)).size} brands,
          filterable by the specs that actually matter — not just vague
          &ldquo;low / mid / high&rdquo; labels.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-md border border-brand-silver px-4 py-2 text-sm font-semibold text-brand-navy lg:hidden"
      >
        Filters {activeCount > 0 && `(${activeCount})`}
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-bold text-brand-navy">
                  Filters
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1 text-brand-navy"
                  aria-label="Close filters"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={setFilters} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-4 w-full rounded-md bg-brand-blue py-2.5 text-sm font-semibold text-white"
              >
                Show {results.length} tees
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-brand-grey">
              {results.length} {results.length === 1 ? "tee" : "tees"} found
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-silver p-12 text-center">
              <p className="font-display text-lg font-bold text-brand-navy">
                No tees match those filters
              </p>
              <p className="mt-1 text-sm text-brand-grey">
                Try clearing a filter or two.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-4 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((tee) => (
                <ProductCard key={tee.slug} tee={tee} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
