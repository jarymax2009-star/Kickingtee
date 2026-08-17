import { getBrands, getCategories, tees, type Tee } from "./products";

export interface FilterState {
  search: string;
  brands: string[];
  categories: string[];
  mechanisms: string[];
  baseBands: string[];
  weightBands: string[];
  materialFamilies: string[];
  gripFamilies: string[];
  codes: string[];
  priceBands: string[];
  endorsedOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  search: "",
  brands: [],
  categories: [],
  mechanisms: [],
  baseBands: [],
  weightBands: [],
  materialFamilies: [],
  gripFamilies: [],
  codes: [],
  priceBands: [],
  endorsedOnly: false,
};

export const BRAND_OPTIONS = getBrands();
export const CATEGORY_OPTIONS = getCategories();
export const MECHANISM_OPTIONS = [
  "Fixed",
  "Telescopic",
  "Screw",
  "Lift-to-adjust",
  "Slide-lock",
  "Stacked discs",
  "Adjustable (other)",
  "Unspecified",
];
export const BASE_BAND_OPTIONS = ["Narrow", "Standard", "Wide"];
export const WEIGHT_BAND_OPTIONS = ["Light", "Mid", "Heavy"];
export const MATERIAL_OPTIONS = [
  "EVA Plastic",
  "Thermoplastic",
  "TPR",
  "Rubber",
  "Polymer",
  "Other",
  "Unspecified",
];
export const GRIP_OPTIONS = [
  "Prong grip",
  "Flat rubber",
  "Support levers",
  "Wide grass-cutting base",
  "Stable base",
  "Other",
  "Unspecified",
];
export const CODE_OPTIONS = ["Union", "League", "Both"];
export const PRICE_BAND_OPTIONS = [
  { value: "Budget", label: "Budget · under £15" },
  { value: "Mid", label: "Mid · £15–£30" },
  { value: "Premium", label: "Premium · over £30" },
];

function matchesMulti(value: string | null, selected: string[]) {
  if (selected.length === 0) return true;
  return selected.includes(value ?? "Unspecified");
}

function matchesCode(code: string | null, selected: string[]) {
  if (selected.length === 0) return true;
  if (code === "Both") return true;
  return selected.includes(code ?? "");
}

export function applyFilters(all: Tee[], f: FilterState): Tee[] {
  const q = f.search.trim().toLowerCase();
  return all.filter((t) => {
    if (q && !`${t.brand} ${t.model}`.toLowerCase().includes(q)) return false;
    if (f.brands.length && !f.brands.includes(t.brand)) return false;
    if (!matchesMulti(t.category, f.categories)) return false;
    if (!matchesMulti(t.mechanismFamily, f.mechanisms)) return false;
    if (!matchesMulti(t.baseBand, f.baseBands)) return false;
    if (!matchesMulti(t.weightBand, f.weightBands)) return false;
    if (!matchesMulti(t.materialFamily, f.materialFamilies)) return false;
    if (!matchesMulti(t.gripFamily, f.gripFamilies)) return false;
    if (!matchesCode(t.code, f.codes)) return false;
    if (f.priceBands.length && !f.priceBands.includes(t.priceBand ?? "")) return false;
    if (f.endorsedOnly && !t.endorsement) return false;
    return true;
  });
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.brands.length +
    f.categories.length +
    f.mechanisms.length +
    f.baseBands.length +
    f.weightBands.length +
    f.materialFamilies.length +
    f.gripFamilies.length +
    f.codes.length +
    f.priceBands.length +
    (f.endorsedOnly ? 1 : 0)
  );
}

export const allTees = tees;
