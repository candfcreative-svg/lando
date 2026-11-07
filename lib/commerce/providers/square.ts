/**
 * Square provider (STUB).
 *
 * Activated with COMMERCE_PROVIDER=square. Every function below lists the
 * Square API calls it will make. Raw responses go through the same mapper as
 * the mock data (`../mapper.ts`), so pages need no changes.
 *
 * Setup:
 *   npm install square
 *   Env: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_ENVIRONMENT, SQUARE_WEBHOOK_SIGNATURE_KEY
 *   SDK docs: https://developer.squareup.com/docs/sdks/nodejs
 */
import "server-only";
import type { CommerceProvider } from "../types";

function notImplemented(fn: string): never {
  throw new Error(
    `[commerce/square] ${fn}() is not implemented yet. Set COMMERCE_PROVIDER=mock, or finish lib/commerce/providers/square.ts (see README › Connecting Square later).`,
  );
}

// TODO: create one client per process.
// import { SquareClient, SquareEnvironment } from "square";
// const square = new SquareClient({
//   token: process.env.SQUARE_ACCESS_TOKEN,
//   environment: process.env.SQUARE_ENVIRONMENT === "production"
//     ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
// });

/**
 * TODO: loadCatalog(): fetch everything once and map it.
 *   1. Catalog API `ListCatalog` with types "ITEM,CATEGORY,IMAGE"
 *      (`square.catalog.list({ types: "ITEM,CATEGORY,IMAGE" })`), following
 *      the cursor until done. Include custom attribute values on items.
 *   2. Inventory API `BatchRetrieveInventoryCounts` for all variation ids,
 *      filtered to SQUARE_LOCATION_ID and states ["IN_STOCK", "SOLD"]
 *      (`square.inventory.batchGetCounts(...)`).
 *   3. Convert bigint `priceMoney.amount` to number (cents).
 *   4. Filter with `isVisibleOnline()` and map with `mapProduct()` from ../mapper.
 *   5. Return Product[]. Caching is handled one level up in lib/commerce/index.ts
 *      (`"use cache"` + cacheTag("catalog") / cacheTag("inventory")), which the
 *      webhook at /api/webhooks/square revalidates.
 */

export const squareProvider: CommerceProvider = {
  name: "square",

  async getProducts(/* filters */) {
    // TODO: const products = await loadCatalog(); return applyFilters(products, filters);
    // (For a very large catalog, switch to Catalog API `SearchCatalogItems`
    //  with category_ids / text_filter and paginate, then apply the rest in memory.)
    return notImplemented("getProducts");
  },

  async getProduct(/* slug */) {
    // TODO: find by `itemData.ecomSeoData.permalink` from loadCatalog().
    // Alternative: store the slug as a custom attribute and use
    // `SearchCatalogObjects` with a custom-attribute exact query.
    return notImplemented("getProduct");
  },

  async getCategories() {
    // TODO: Catalog API `ListCatalog` with types "CATEGORY", then
    // `mapCategory(cat, countOfAvailableProducts)`. The category's
    // `ecomSeoData.permalink` must be one of: sneakers, clothing, cards,
    // collectibles, figures, memorabilia, art.
    return notImplemented("getCategories");
  },

  async getInventory(/* variantIds */) {
    // TODO: Inventory API `BatchRetrieveInventoryCounts`
    //   { catalogObjectIds: variantIds, locationIds: [SQUARE_LOCATION_ID], states: ["IN_STOCK"] }
    // Do NOT cache this one; it's used for the live stock re-check before checkout.
    return notImplemented("getInventory");
  },

  async createCheckout(/* lines */) {
    // TODO:
    //   1. Re-check stock with getInventory(); return { ok: false, issues } if anything sold.
    //   2. Checkout API `CreatePaymentLink` (`square.checkout.paymentLinks.create`) with:
    //        idempotencyKey: crypto.randomUUID(),
    //        order: { locationId: SQUARE_LOCATION_ID,
    //                 lineItems: lines.map(l => ({ catalogObjectId: l.variantId, quantity: String(l.quantity) })) },
    //        checkoutOptions: { redirectUrl: `${NEXT_PUBLIC_SITE_URL}/checkout/confirmation`,
    //                           askForShippingAddress: true }
    //   3. Return { ok: true, isDemo: false, checkoutUrl: paymentLink.url, orderId: paymentLink.orderId, subtotal }.
    // Square decrements inventory automatically when the order is paid, which fires
    // the inventory.count.updated webhook and refreshes the site.
    return notImplemented("createCheckout");
  },
};
