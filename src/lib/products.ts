import raw from "./products-data.json";

export type PriceBand = "Budget" | "Mid" | "Premium";
export type WeightBand = "Light" | "Mid" | "Heavy";
export type BaseBand = "Narrow" | "Standard" | "Wide";
export type Code = "Union" | "League" | "Both";
export type MechanismFamily =
  | "Fixed"
  | "Telescopic"
  | "Screw"
  | "Lift-to-adjust"
  | "Slide-lock"
  | "Stacked discs"
  | "Adjustable (other)"
  | "Unspecified";
export type PriceConfidence = "confirmed" | "listed" | "estimated";
export type MaterialFamily =
  | "EVA Plastic"
  | "Thermoplastic"
  | "TPR"
  | "Rubber"
  | "Polymer"
  | "Other"
  | "Unspecified";
export type GripFamily =
  | "Prong grip"
  | "Flat rubber"
  | "Support levers"
  | "Wide grass-cutting base"
  | "Stable base"
  | "Other"
  | "Unspecified";

export interface TeeColor {
  name: string;
  hex: string;
}

export interface Tee {
  slug: string;
  brand: string;
  model: string;
  category: string | null;
  heightMm: number | null;
  adjustableRangeMm: string | number | null;
  mechanism: string | null;
  mechanismFamily: MechanismFamily;
  baseDiameterMm: number | null;
  baseBand: BaseBand | null;
  cupAngleDeg: string | number | null;
  weightG: number | null;
  weightBand: WeightBand | null;
  material: string | null;
  materialFamily: MaterialFamily;
  shoreHardness: string | null;
  gripType: string | null;
  gripFamily: GripFamily;
  windRating: number | null;
  wetRating: number | null;
  code: Code | null;
  priceGBP: number | null;
  priceBand: PriceBand | null;
  priceConfidence: PriceConfidence | null;
  sourceUrl: string | null;
  endorsement: string | null;
  notes: string;
  colors: TeeColor[];
}

export const tees = raw as Tee[];

export function getAllTees(): Tee[] {
  return tees;
}

export function getTeeBySlug(slug: string): Tee | undefined {
  return tees.find((t) => t.slug === slug);
}

export function getBrands(): string[] {
  return Array.from(new Set(tees.map((t) => t.brand))).sort();
}

export function getCategories(): string[] {
  return Array.from(
    new Set(tees.map((t) => t.category).filter((c): c is string => !!c))
  ).sort();
}

export function getMechanismFamilies(): MechanismFamily[] {
  return Array.from(new Set(tees.map((t) => t.mechanismFamily))).sort() as MechanismFamily[];
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return `£${price.toFixed(2)}`;
}

export function isPurchasable(t: Tee): boolean {
  return t.priceGBP !== null;
}
