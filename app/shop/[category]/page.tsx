import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopView, ShopSkeleton } from "@/components/shop-view";
import { CATEGORY_INFO } from "@/data/catalog";
import type { CategorySlug } from "@/lib/commerce/types";

const isCategory = (s: string): s is CategorySlug => s in CATEGORY_INFO;

export function generateStaticParams() {
  return Object.keys(CATEGORY_INFO).map((category) => ({ category }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  if (!isCategory(category)) return {};
  const info = CATEGORY_INFO[category];
  return {
    title: info.name,
    description: info.description,
    alternates: { canonical: `/shop/${category}` },
    openGraph: { title: `${info.name} · Lando Ripsday`, description: info.description, url: `/shop/${category}` },
  };
}

export default function CategoryPage(props: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <CategoryContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function CategoryContent({ params, searchParams }: Pick<PageProps<"/shop/[category]">, "params" | "searchParams">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const info = CATEGORY_INFO[category];
  return <ShopView category={category} title={info.name} description={info.description} searchParams={searchParams} />;
}
