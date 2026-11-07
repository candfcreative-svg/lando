import type { Metadata } from "next";
import { ShopView } from "@/components/shop-view";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop one-of-a-kind sneakers, graded cards, collectibles, figures, memorabilia and art. New pieces added every week.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop all · Lando Ripsday", url: "/shop" },
};

export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <ShopView
      title="Shop all"
      description="Every piece in the vault. Most are one of a kind, so filter fast."
      searchParams={props.searchParams}
    />
  );
}
