/**
 * Square webhook → on-demand revalidation.
 *
 * Subscribe in the Square Developer Dashboard (Webhooks → Add subscription):
 *   URL:    https://YOUR-DOMAIN/api/webhooks/square
 *   Events: inventory.count.updated, catalog.version.updated
 *
 * Square signs each request: base64(HMAC-SHA256(signatureKey, notificationUrl + rawBody))
 * in the `x-square-hmacsha256-signature` header.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/commerce";

function isValidSignature(body: string, signature: string | null): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const url = process.env.SQUARE_WEBHOOK_URL;
  if (!key || !url || !signature) return false;
  const expected = createHmac("sha256", key).update(url + body).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (process.env.COMMERCE_PROVIDER !== "square") {
    return Response.json({ ok: false, error: "Square is not connected (COMMERCE_PROVIDER is not 'square')." }, { status: 501 });
  }

  const body = await request.text();
  if (!isValidSignature(body, request.headers.get("x-square-hmacsha256-signature"))) {
    return Response.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as { type?: string };
  switch (event.type) {
    case "inventory.count.updated":
      // Stock changed (online sale, in-person sale at a show, Whatnot sale entered in Square, etc.)
      // expire: 0 so a sold one-of-one never shows as available, even once.
      revalidateTag(CACHE_TAGS.inventory, { expire: 0 });
      break;
    case "catalog.version.updated":
      // Items added, edited, re-priced or hidden.
      revalidateTag(CACHE_TAGS.catalog, { expire: 0 });
      break;
    default:
      // Unsubscribed event types are acknowledged and ignored.
      break;
  }

  return Response.json({ ok: true, type: event.type ?? null });
}
