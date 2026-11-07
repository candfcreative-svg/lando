import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BadgeCheck, Radio, Store, Truck } from "lucide-react";
import { Pill } from "@/components/badges";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { ProductGrid } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site";
import { getProduct, getProducts } from "@/lib/commerce";
import type { Product } from "@/lib/commerce/types";
import { absoluteUrl, formatDate, formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const products = await getProducts({ availability: "all" });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Item not found" };
  const description = `${product.isSold ? "SOLD · " : `${formatPrice(product.price)} · `}${product.description}`.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      images: product.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt })),
    },
  };
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const sameCategory = await getProducts({ category: product.category.slug, excludeId: product.id, limit: 4 });
  const related =
    sameCategory.length >= 4
      ? sameCategory
      : [...sameCategory, ...(await getProducts({ excludeId: product.id, limit: 8 })).filter((p) => p.category.slug !== product.category.slug)].slice(0, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-silver">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/shop" className="hover:text-chrome">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/shop/${product.category.slug}`} className="hover:text-chrome">
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="line-clamp-1 text-chrome">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
          <Gallery images={product.images} sold={product.isSold} />

          <div>
            <div className="flex flex-wrap gap-2">
              {product.isSold && <Pill tone="sold">Sold</Pill>}
              {product.isOneOfOne && !product.isSold && <Pill tone="blaze">1 of 1</Pill>}
              {product.grade && <Pill tone="chrome">{product.grade}</Pill>}
              <Pill>{product.category.name}</Pill>
            </div>
            {product.brand && <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-silver">{product.brand}</p>}
            <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight text-chrome sm:text-4xl">{product.name}</h1>

            <div className="mt-6">
              {product.isSold ? (
                <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                  <p className="display text-4xl text-sold">Sold{product.soldAt ? ` · ${formatDate(product.soldAt)}` : ""}</p>
                  <p className="mt-1 text-sm text-silver">Last sold for {formatPrice(product.price)}</p>
                  <p className="mt-3 text-mist">
                    This one&apos;s gone, but similar pieces drop every week. New heat usually hits the live show first.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/shop/${product.category.slug}`} className="inline-flex h-12 items-center rounded-full bg-blaze px-6 font-bold text-ink hover:bg-blaze-hi">
                      Shop similar {product.category.name.toLowerCase()}
                    </Link>
                    <a
                      href={site.links.whatnot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-bold text-chrome ring-2 ring-chrome/30 hover:ring-blaze"
                    >
                      <Radio className="size-4" aria-hidden /> Catch the next show
                    </a>
                  </div>
                </div>
              ) : (
                <BuyBox product={product} />
              )}
            </div>

            {product.details.length > 0 && (
              <section className="mt-8" aria-labelledby="details-title">
                <h2 id="details-title" className="display text-2xl text-blaze">
                  Details
                </h2>
                <dl className="mt-3 divide-y divide-white/10 rounded-xl bg-white/[0.03] ring-1 ring-white/10">
                  {product.details.map((d) => (
                    <div key={d.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
                      <dt className="text-silver">{d.label}</dt>
                      <dd className="font-semibold text-chrome">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="mt-8" aria-labelledby="desc-title">
              <h2 id="desc-title" className="display text-2xl text-blaze">
                Description
              </h2>
              <p className="mt-2 leading-relaxed text-mist">{product.description}</p>
            </section>

            <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-blaze" aria-hidden />
                <span className="text-mist">Inspected &amp; authenticated</span>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
                <Truck className="mt-0.5 size-5 shrink-0 text-blaze" aria-hidden />
                <span className="text-mist">Free shipping over ${site.shipping.freeOver}</span>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
                <Store className="mt-0.5 size-5 shrink-0 text-blaze" aria-hidden />
                <span className="text-mist">
                  <Link href="/shows" className="underline-offset-2 hover:text-chrome hover:underline">
                    Pick up at a show
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <SectionHeading id="related-title" eyebrow="Keep digging" title="You might also like" href={`/shop/${product.category.slug}`} linkLabel={`More ${product.category.name.toLowerCase()}`} />
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  );
}

function ProductJsonLd({ product }: { product: Product }) {
  const usedConditions = ["USED", "VNDS", "Played with", "Excellent", "Like new", "Near mint"];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => absoluteUrl(i.url)),
    sku: product.variants[0]?.sku,
    category: product.category.name,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: product.currency,
      price: (product.price / 100).toFixed(2),
      availability: product.isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition:
        product.condition && usedConditions.includes(product.condition)
          ? "https://schema.org/UsedCondition"
          : "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    },
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so product text can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pb-16 pt-6 sm:px-6 sm:pt-10" aria-busy="true" aria-label="Loading item">
      <div className="mb-6 h-5 w-48 rounded bg-white/5" />
      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="aspect-square rounded-2xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-white/5" />
          <div className="h-10 w-3/4 rounded bg-white/5" />
          <div className="h-12 w-40 rounded bg-white/5" />
          <div className="h-14 rounded-full bg-white/5" />
          <div className="h-48 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
