/**
 * Mock provider: reads the Square-shaped demo catalog in `data/catalog.ts`.
 * No network calls. Checkout validates stock and returns a demo confirmation.
 */
import "server-only";
import { mockCategories, mockImages, mockInventory, mockItems } from "@/data/catalog";
import { isVisibleOnline, mapCategory, mapProduct } from "../mapper";
import { applyFilters } from "../query";
import type { CartLine, CheckoutLineIssue, CommerceProvider, Product } from "../types";

const categoryMap = new Map(mockCategories.map((c) => [c.id, c]));
const imageMap = new Map(mockImages.map((i) => [i.id, i]));

// Mapped once at module load; the mock catalog never changes at runtime.
const allProducts: Product[] = mockItems
  .filter(isVisibleOnline)
  .map((item) => {
    const varIds = new Set(item.itemData.variations.map((v) => v.id));
    return mapProduct(item, categoryMap, imageMap, mockInventory.filter((c) => varIds.has(c.catalogObjectId)));
  })
  .filter((p): p is Product => p !== null);

const variantIndex = new Map(allProducts.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));

export const mockProvider: CommerceProvider = {
  name: "mock",

  async getProducts(filters) {
    return applyFilters(allProducts, filters);
  },

  async getProduct(slug) {
    return allProducts.find((p) => p.slug === slug) ?? null;
  },

  async getCategories() {
    return mockCategories.map((c) =>
      mapCategory(c, allProducts.filter((p) => p.category.id === c.id && !p.isSold).length),
    );
  },

  async getInventory(variantIds) {
    return variantIds.map((id) => {
      const hit = variantIndex.get(id);
      return { variantId: id, stock: hit?.variant.stock ?? 0, updatedAt: hit?.product.createdAt ?? "" };
    });
  },

  async createCheckout(lines: CartLine[]) {
    // Re-check stock before "charging", exactly as the Square provider will.
    const issues: CheckoutLineIssue[] = [];
    let subtotal = 0;
    for (const line of lines) {
      const hit = variantIndex.get(line.variantId);
      if (!hit) {
        issues.push({ variantId: line.variantId, reason: "not_found", available: 0 });
        continue;
      }
      const available = hit.variant.stock;
      if (available === 0) issues.push({ variantId: line.variantId, reason: "sold_out", available });
      else if (line.quantity > available)
        issues.push({ variantId: line.variantId, reason: "insufficient_stock", available });
      subtotal += hit.variant.price * Math.min(line.quantity, available);
    }
    if (issues.length) return { ok: false, issues };

    const orderId = `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return {
      ok: true,
      isDemo: true,
      orderId,
      subtotal,
      checkoutUrl: `/checkout/confirmation?order=${orderId}`,
    };
  },
};
