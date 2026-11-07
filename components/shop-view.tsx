import { Suspense } from "react";
import Link from "next/link";
import { getFacets, getProducts } from "@/lib/commerce";
import type { CategorySlug } from "@/lib/commerce/types";
import { parseShopParams } from "@/lib/shop-params";
import { ProductGrid } from "./product-card";
import { ShopToolbar, FilterSidebar } from "./shop-filters";

type SP = Promise<Record<string, string | string[] | undefined>>;

export function ShopView({
  category,
  title,
  description,
  searchParams,
}: {
  category?: CategorySlug;
  title: string;
  description: string;
  searchParams: SP;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-silver">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-chrome">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          {category ? (
            <>
              <li>
                <Link href="/shop" className="hover:text-chrome">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-chrome">
                {title}
              </li>
            </>
          ) : (
            <li aria-current="page" className="text-chrome">
              Shop
            </li>
          )}
        </ol>
      </nav>
      <h1 className="display text-6xl sm:text-7xl">
        <span className="text-chrome-grad">{title}</span>
      </h1>
      <p className="mt-2 max-w-2xl text-mist">{description}</p>

      <Suspense fallback={<ResultsSkeleton />}>
        <Results category={category} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ category, searchParams }: { category?: CategorySlug; searchParams: SP }) {
  const filters = parseShopParams(await searchParams, category);
  const [products, facets] = await Promise.all([getProducts(filters), getFacets({ category })]);

  return (
    <div className="mt-8">
      <ShopToolbar count={products.length} facets={facets} showCategory={!category} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
        <FilterSidebar facets={facets} showCategory={!category} />
        <div>
          {products.length ? (
            <ProductGrid products={products} priorityCount={4} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
              <p className="display text-4xl">Nothing here… yet</p>
              <p className="mx-auto mt-2 max-w-md text-mist">
                Inventory moves fast. Try clearing a filter, or catch the next live show where new pieces drop first.
              </p>
              <Link
                href={category ? `/shop/${category}` : "/shop"}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-blaze px-5 font-bold text-ink hover:bg-blaze-hi"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="h-5 w-32 rounded bg-white/5" />
      <div className="mt-4 h-16 w-64 rounded bg-white/5" />
      <ResultsSkeleton />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-8 animate-pulse" aria-busy="true" aria-label="Loading products">
      <div className="h-11 rounded-full bg-white/5" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden h-96 rounded-xl bg-white/5 lg:block" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square rounded-xl bg-white/5" />
              <div className="mt-3 h-4 w-3/4 rounded bg-white/5" />
              <div className="mt-2 h-6 w-1/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
