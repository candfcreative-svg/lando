# Lando Ripsday: Store Demo

A clickable demo storefront for **Lando Ripsday**: sneakers, clothing, cards, collectibles, figures, memorabilia and art. Most items are one of a kind.

- **Stack:** Next.js 16 (App Router, TypeScript, Cache Components), Tailwind CSS v4, hosted on Vercel
- **Data:** mock catalog now, shaped exactly like Square's Catalog and Inventory APIs. Switching to Square is an env var change plus one provider file (see [Connecting Square later](#connecting-square-later)).

> Everything in this demo (products, shows, links, contact details, images) is **placeholder content**.

---

## Running locally

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local   # defaults to COMMERCE_PROVIDER=mock
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start` (serve the production build), `npm run lint`.

## Project structure

```
app/                     Routes (App Router)
  api/webhooks/square/   Square webhook → on-demand revalidation
lib/commerce/            The data access layer. Pages import ONLY from "@/lib/commerce"
  index.ts               Public API + caching; picks provider from COMMERCE_PROVIDER
  types.ts               App types (Product, Category, CartLine, CheckoutResult…)
  square-types.ts        Square Catalog/Inventory object shapes
  mapper.ts              Square-shaped objects → Product (shared by both providers)
  query.ts               Filtering, sorting, filter facets (shared)
  providers/mock.ts      Working provider backed by data/catalog.ts
  providers/square.ts    Stub with TODOs for each Square API call
data/
  products.ts            Editable list of mock items
  catalog.ts             Converts products.ts into Square-shaped objects
  shows.ts               Editable shows/events list (Whatnot + in-person)
  site.ts                Store name, links, contact, weekly show, shipping
public/brand/            Logo
public/placeholders/     Placeholder product images
```

### Data access API

```ts
import { getProducts, getProduct, getCategories, getInventory, createCheckout } from "@/lib/commerce";

await getProducts({ category: "cards", grades: ["PSA 10"], sort: "price-desc" });
await getProduct("2018-prizm-luka-doncic-rc-280-psa-10");
await getCategories();
await getInventory(["VARIANT_ID"]);      // live stock, never cached
await createCheckout([{ variantId, quantity: 1 }]);  // re-checks stock first
```

### Editing demo content

- **Products:** `data/products.ts`. Set `stock: 0` to show an item as SOLD.
- **Shows & events:** `data/shows.ts`. Past events hide automatically.
- **Store details & links:** `data/site.ts` or the `NEXT_PUBLIC_*` env vars.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo. The framework is detected as Next.js automatically.
3. Under **Environment Variables**, add `COMMERCE_PROVIDER=mock` and `NEXT_PUBLIC_SITE_URL=https://<your-vercel-domain>` (plus any `NEXT_PUBLIC_*` links).
4. Click **Deploy**. Every push to `main` redeploys, and pull requests get preview URLs.

## Connecting Square later

1. **Create a Square app.** In the [Square Developer Dashboard](https://developer.squareup.com/apps), create an application. Note the **access token** (sandbox first, then production) and the **location ID** the site will sell from.
2. **Set up the catalog in Square.**
   - Create categories whose SEO permalink is one of `sneakers, clothing, cards, collectibles, figures, memorabilia, art`.
   - Create custom attribute definitions with these keys: `brand, model, colorway, condition, box_included, player, set, year, card_number, grading_company, grade, cert_number, brand_line, in_box, coa_source, signed_by, artist, medium, dimensions`.
   - Use **item variations for sizes**, turn on **inventory tracking**, and set each item's online visibility.
3. **Implement the Square provider.** `npm install square`, then fill in each TODO in `lib/commerce/providers/square.ts`:
   - Load the catalog with `ListCatalog` (ITEM, CATEGORY, IMAGE) and stock with `BatchRetrieveInventoryCounts`.
   - Map results with the existing `mapProduct()` / `mapCategory()` from `lib/commerce/mapper.ts`, and filter with `applyFilters()` from `lib/commerce/query.ts`.
4. **Add environment variables** (locally in `.env.local` and in Vercel → Settings → Environment Variables):
   ```
   COMMERCE_PROVIDER=square
   SQUARE_ACCESS_TOKEN=...
   SQUARE_ENVIRONMENT=sandbox        # then production
   SQUARE_LOCATION_ID=...
   SQUARE_WEBHOOK_SIGNATURE_KEY=...
   SQUARE_WEBHOOK_URL=https://<your-domain>/api/webhooks/square
   ```
5. **Set up the webhook.** In the dashboard, go to **Webhooks → Add subscription**:
   - URL: `https://<your-domain>/api/webhooks/square`
   - Events: **`inventory.count.updated`** and **`catalog.version.updated`**
   - Copy the signature key into `SQUARE_WEBHOOK_SIGNATURE_KEY`.

   `app/api/webhooks/square/route.ts` already verifies the signature and calls `revalidateTag("inventory")` or `revalidateTag("catalog")`. That's on-demand revalidation, so a sale at a show or on Whatnot marks the item SOLD on the site within seconds.
6. **Switch checkout to the Square Checkout API.** In `createCheckout()`, call `CreatePaymentLink` with the cart's variation IDs as order line items and `redirectUrl` set to `/checkout/confirmation`. Return the payment link URL. The cart page already redirects to whatever `checkoutUrl` the provider returns, and the "Demo" banner hides automatically when `isDemo` is false.
7. **Re-check stock before checkout.** Before creating the payment link, call `getInventory()` (uncached, live from Square) for every cart line. If anything sold in the meantime, return `{ ok: false, issues }` and the cart shows which items are no longer available.
8. **Test end to end in sandbox.** Buy an item with a [sandbox test card](https://developer.squareup.com/docs/devtools/sandbox/payments), confirm the webhook fires and the item flips to SOLD, then switch the env vars to production.
