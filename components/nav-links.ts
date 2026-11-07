import { CATEGORY_INFO } from "@/data/catalog";
import type { CategorySlug } from "@/lib/commerce/types";

export const categoryLinks = (Object.keys(CATEGORY_INFO) as CategorySlug[]).map((slug) => ({
  href: `/shop/${slug}`,
  label: CATEGORY_INFO[slug].name,
}));

export const mainLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/shows", label: "Shows" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
