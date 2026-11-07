/**
 * Filtering, sorting and facet helpers that work on mapped `Product`s.
 * Shared by every provider, so filter behavior is identical in mock and Square.
 */
import type { FilterFacets, Product, ProductFilters } from "./types";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function applyFilters(products: Product[], f: ProductFilters = {}): Product[] {
  const availability = f.availability ?? "available";
  const q = f.q ? normalize(f.q) : "";

  let out = products.filter((p) => {
    if (f.excludeId && p.id === f.excludeId) return false;
    if (f.category && p.category.slug !== f.category) return false;
    if (availability === "available" && p.isSold) return false;
    if (availability === "sold" && !p.isSold) return false;
    if (f.minPrice !== undefined && p.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false;
    if (f.brands?.length && !(p.brand && f.brands.includes(p.brand))) return false;
    if (f.grades?.length && !(p.grade && f.grades.includes(p.grade))) return false;
    if (f.sizes?.length) {
      // A size matches only if that size is actually in stock (or the item is sold and we're showing sold).
      const ok = p.variants.some((v) => f.sizes!.includes(v.name) && (v.stock > 0 || availability !== "available"));
      if (!ok) return false;
    }
    if (q) {
      const hay = normalize([p.name, p.brand, p.category.name, ...p.details.map((d) => d.value)].join(" "));
      if (!q.split(/\s+/).every((term) => hay.includes(term))) return false;
    }
    return true;
  });

  const sort = f.sort ?? "newest";
  out = out.slice().sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (availability === "sold") return (b.soldAt ?? "").localeCompare(a.soldAt ?? "");
    return b.createdAt.localeCompare(a.createdAt);
  });

  return f.limit ? out.slice(0, f.limit) : out;
}

function sortSizes(a: string, b: string) {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  if (!Number.isNaN(na)) return -1;
  if (!Number.isNaN(nb)) return 1;
  const ia = SIZE_ORDER.indexOf(a);
  const ib = SIZE_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

/** Options for the filter sidebar, built from whatever products are in scope. */
export function buildFacets(products: Product[]): FilterFacets {
  const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => Boolean(x)))];
  const prices = products.map((p) => p.price);
  return {
    brands: uniq(products.map((p) => p.brand)).sort((a, b) => a.localeCompare(b)),
    sizes: uniq(products.flatMap((p) => p.sizes)).sort(sortSizes),
    grades: uniq(products.map((p) => p.grade)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  };
}
