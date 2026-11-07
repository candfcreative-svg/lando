/**
 * The ONLY module pages should import commerce data from.
 *
 *   import { getProducts, getProduct } from "@/lib/commerce";
 *
 * The provider is picked by COMMERCE_PROVIDER (mock | square). Reads are
 * cached with `"use cache"` and tagged, so the Square webhook can refresh them
 * on demand with revalidateTag (see app/api/webhooks/square/route.ts).
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { mockProvider } from "./providers/mock";
import { squareProvider } from "./providers/square";
import { buildFacets } from "./query";
import type { CartLine, CommerceProvider, ProductFilters } from "./types";

export * from "./types";

export const CACHE_TAGS = {
  catalog: "catalog",
  inventory: "inventory",
  product: (slug: string) => `product:${slug}`,
} as const;

function provider(): CommerceProvider {
  const name = process.env.COMMERCE_PROVIDER ?? "mock";
  if (name === "square") return squareProvider;
  if (name !== "mock") console.warn(`[commerce] Unknown COMMERCE_PROVIDER "${name}", using mock.`);
  return mockProvider;
}

export function getProviderName() {
  return provider().name;
}

export async function getProducts(filters: ProductFilters = {}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.inventory);
  return provider().getProducts(filters);
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.inventory, CACHE_TAGS.product(slug));
  return provider().getProduct(slug);
}

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.inventory);
  return provider().getCategories();
}

export async function getCategory(slug: string) {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

/** Filter options (brands, sizes, grades, price range) for a set of products. */
export async function getFacets(filters: Pick<ProductFilters, "category" | "availability"> = {}) {
  const products = await getProducts({ category: filters.category, availability: filters.availability ?? "all" });
  return buildFacets(products);
}

/** Live stock. Intentionally NOT cached: used to re-check before checkout. */
export async function getInventory(variantIds: string[]) {
  return provider().getInventory(variantIds);
}

/** Validates stock, then starts checkout (demo confirmation for mock, Square payment link later). */
export async function createCheckout(lines: CartLine[]) {
  return provider().createCheckout(lines);
}
