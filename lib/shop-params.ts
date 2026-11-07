import type { Availability, CategorySlug, ProductFilters, SortOption } from "@/lib/commerce/types";

export const PRICE_PRESETS = [
  { value: "0-100", label: "Under $100" },
  { value: "100-250", label: "$100 – $250" },
  { value: "250-500", label: "$250 – $500" },
  { value: "500-1000", label: "$500 – $1,000" },
  { value: "1000-", label: "$1,000+" },
] as const;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(",") : (v ?? "")).split(",").map((s) => s.trim()).filter(Boolean);

/** URL search params → ProductFilters. Unknown values are ignored. */
export function parseShopParams(sp: RawParams, category?: CategorySlug): ProductFilters {
  const sort = one(sp.sort) as SortOption | undefined;
  const availability = one(sp.availability) as Availability | undefined;
  const [min, max] = (one(sp.price) ?? "").split("-");
  return {
    category,
    q: one(sp.q)?.slice(0, 80) || undefined,
    sort: SORT_OPTIONS.some((s) => s.value === sort) ? sort : "newest",
    availability: availability === "sold" || availability === "all" ? availability : "available",
    minPrice: min ? Number(min) * 100 : undefined,
    maxPrice: max ? Number(max) * 100 : undefined,
    sizes: list(sp.size),
    brands: list(sp.brand),
    grades: list(sp.grade),
  };
}
