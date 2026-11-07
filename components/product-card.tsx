import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { formatDate, formatPrice } from "@/lib/format";
import { Pill, SoldStamp } from "./badges";
import { ProductImage } from "./product-image";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const img = product.images[0];
  const subtitle =
    product.category.slug === "cards"
      ? product.grade ?? "Raw"
      : product.sizes.length === 1
        ? `Size ${product.sizes[0]}`
        : product.sizes.length > 1
          ? `${product.sizes.length} sizes`
          : undefined;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-paper shadow-lift ring-1 ring-black/5">
        {img && (
          <ProductImage
            src={img.url}
            alt={img.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className={`object-cover transition duration-500 group-hover:scale-[1.04] ${product.isSold ? "grayscale-[60%]" : ""}`}
          />
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {product.isOneOfOne && !product.isSold && <Pill tone="blaze">1 of 1</Pill>}
          {product.category.slug === "cards" && product.grade && <Pill>{product.grade}</Pill>}
          {product.condition === "DS" && <Pill tone="chrome">DS</Pill>}
        </div>
        {product.isSold && <SoldStamp />}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-silver">{product.brand ?? product.details.find((d) => d.key === "set")?.value ?? product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-chrome">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none group-hover:text-blaze">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
          {product.isSold ? (
            <p className="whitespace-nowrap text-sm font-semibold text-silver">
              <span className="sr-only">Sold. </span>Sold{product.soldAt ? ` ${formatDate(product.soldAt)}` : ""}
            </p>
          ) : (
            <p className="display text-2xl not-italic text-blaze">{formatPrice(product.price)}</p>
          )}
          {subtitle && <p className="truncate text-xs text-mist">{subtitle}</p>}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <div className="w-full">
            <ProductCard product={p} priority={i < priorityCount} />
          </div>
        </li>
      ))}
    </ul>
  );
}
