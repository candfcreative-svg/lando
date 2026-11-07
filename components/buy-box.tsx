"use client";

import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";

/** Size picker + purchase buttons. Cart wiring lands in Phase C. */
export function BuyBox({ product }: { product: Product }) {
  const multi = product.variants.length > 1;
  const firstAvailable = product.variants.find((v) => v.stock > 0);
  const [variantId, setVariantId] = useState(multi ? undefined : firstAvailable?.id);
  const variant = product.variants.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;

  return (
    <div>
      <p className="display text-5xl not-italic text-blaze">
        {multi && !variant && product.variants.some((v) => v.price !== product.price) && <span className="mr-1 text-2xl text-mist">From</span>}
        {formatPrice(price)}
      </p>

      {multi && (
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-semibold text-chrome">
            Size{variant ? `: ${variant.name}` : ""}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const out = v.stock === 0;
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={out}
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={active}
                  className={`relative min-w-14 rounded-lg px-4 py-2.5 font-semibold ring-1 transition ${
                    active
                      ? "bg-blaze text-ink ring-blaze"
                      : out
                        ? "cursor-not-allowed text-silver/50 line-through ring-white/10"
                        : "text-chrome ring-white/25 hover:ring-blaze"
                  }`}
                >
                  {v.name}
                  <span className="sr-only">{out ? " (sold out)" : v.stock <= 2 ? ` (${v.stock} left)` : ""}</span>
                </button>
              );
            })}
          </div>
          {variant && variant.stock <= 3 && <p className="mt-2 text-sm font-semibold text-blaze">Only {variant.stock} left in this size</p>}
        </fieldset>
      )}

      {!multi && product.stock > 1 && <p className="mt-3 text-sm font-semibold text-blaze">{product.stock} available</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!variant}
          className="h-14 rounded-full bg-blaze text-lg font-bold text-ink shadow-[0_10px_30px_-10px_rgb(244_116_27/0.8)] transition hover:bg-blaze-hi disabled:cursor-not-allowed disabled:opacity-50"
        >
          {variant ? "Buy now" : "Select a size"}
        </button>
        <button
          type="button"
          disabled={!variant}
          className="h-14 rounded-full text-lg font-bold text-chrome ring-2 ring-chrome/30 transition hover:ring-blaze disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
