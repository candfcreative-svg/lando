/**
 * Turns Square-shaped catalog + inventory objects into the app's `Product`.
 * Used by both the mock provider and the (future) Square provider.
 */
import type {
  SquareCatalogCategory,
  SquareCatalogImage,
  SquareCatalogItem,
  SquareCustomAttributeValue,
  SquareInventoryCount,
} from "./square-types";
import type { Category, CategorySlug, Product, ProductDetail } from "./types";

/** Which custom attributes each category shows, in display order. */
export const DETAIL_FIELDS: Record<CategorySlug, { key: string; label: string }[]> = {
  sneakers: [
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "colorway", label: "Colorway" },
    { key: "size", label: "Size" },
    { key: "condition", label: "Condition" },
    { key: "box_included", label: "Box included" },
  ],
  clothing: [
    { key: "brand", label: "Brand" },
    { key: "size", label: "Size" },
    { key: "condition", label: "Condition" },
  ],
  cards: [
    { key: "player", label: "Player / Character" },
    { key: "set", label: "Set" },
    { key: "year", label: "Year" },
    { key: "card_number", label: "Card #" },
    { key: "grading_company", label: "Grading company" },
    { key: "grade", label: "Grade" },
    { key: "cert_number", label: "Cert #" },
  ],
  collectibles: [
    { key: "brand_line", label: "Brand / Line" },
    { key: "condition", label: "Condition" },
    { key: "in_box", label: "In box" },
  ],
  figures: [
    { key: "brand_line", label: "Brand / Line" },
    { key: "condition", label: "Condition" },
    { key: "in_box", label: "In box" },
  ],
  memorabilia: [
    { key: "signed_by", label: "Signed by" },
    { key: "coa_source", label: "Authentication" },
  ],
  art: [
    { key: "artist", label: "Artist" },
    { key: "medium", label: "Medium" },
    { key: "dimensions", label: "Dimensions" },
  ],
};

const CONDITION_LABELS: Record<string, string> = {
  DS: "DS (deadstock, brand new)",
  VNDS: "VNDS (very near deadstock)",
  USED: "Used",
};

function attrValue(attr?: SquareCustomAttributeValue): string | undefined {
  if (!attr) return undefined;
  if (attr.type === "BOOLEAN") {
    return attr.booleanValue === undefined ? undefined : attr.booleanValue ? "Yes" : "No";
  }
  const v = attr.type === "NUMBER" ? attr.numberValue : attr.stringValue;
  return v?.trim() ? v.trim() : undefined;
}

export function mapCategory(cat: SquareCatalogCategory, productCount: number, description = ""): Category {
  return {
    id: cat.id,
    slug: (cat.categoryData.ecomSeoData?.permalink ?? cat.categoryData.name.toLowerCase()) as CategorySlug,
    name: cat.categoryData.name,
    description: cat.categoryData.ecomSeoData?.pageDescription ?? description,
    productCount,
  };
}

export function slugFor(item: SquareCatalogItem): string {
  return (
    item.itemData.ecomSeoData?.permalink ??
    item.itemData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function isVisibleOnline(item: SquareCatalogItem): boolean {
  if (item.isDeleted || item.itemData.isArchived) return false;
  const vis = item.itemData.ecomVisibility ?? "VISIBLE";
  return vis === "VISIBLE" || vis === "UNINDEXED";
}

export function mapProduct(
  item: SquareCatalogItem,
  categories: Map<string, SquareCatalogCategory>,
  images: Map<string, SquareCatalogImage>,
  counts: SquareInventoryCount[],
): Product | null {
  const catRef = item.itemData.categories?.[0]?.id ?? item.itemData.reportingCategory?.id;
  const cat = catRef ? categories.get(catRef) : undefined;
  if (!cat) return null;
  const category = mapCategory(cat, 0);
  const attrs = item.customAttributeValues ?? {};

  const variants = item.itemData.variations
    .slice()
    .sort((a, b) => (a.itemVariationData.ordinal ?? 0) - (b.itemVariationData.ordinal ?? 0))
    .map((v) => {
      const inStock = counts.find((c) => c.catalogObjectId === v.id && c.state === "IN_STOCK");
      return {
        id: v.id,
        name: v.itemVariationData.name,
        sku: v.itemVariationData.sku,
        price: v.itemVariationData.priceMoney.amount,
        stock: v.itemVariationData.trackInventory ? Math.max(0, Math.floor(Number(inStock?.quantity ?? 0))) : 99,
      };
    });

  const stock = variants.reduce((n, v) => n + v.stock, 0);
  const sizeVariants = variants.filter((v) => v.name !== "Regular" && v.name !== "One size");
  const sizes = sizeVariants.map((v) => v.name);

  // Specs: only fields this category uses, only those with values.
  const details: ProductDetail[] = [];
  for (const field of DETAIL_FIELDS[category.slug] ?? []) {
    let value: string | undefined;
    if (field.key === "size") {
      // Single-size items show size as a spec; multi-size items use the size picker.
      value = sizes.length === 1 ? sizes[0] : undefined;
    } else {
      value = attrValue(attrs[field.key]);
      if (field.key === "condition" && value) value = CONDITION_LABELS[value] ?? value;
    }
    if (value) details.push({ key: field.key, label: field.label, value });
  }

  const soldCount = counts
    .filter((c) => variants.some((v) => v.id === c.catalogObjectId) && c.state === "SOLD")
    .sort((a, b) => b.calculatedAt.localeCompare(a.calculatedAt))[0];

  const gradingCompany = attrValue(attrs.grading_company);
  const grade = attrValue(attrs.grade);

  return {
    id: item.id,
    slug: slugFor(item),
    name: item.itemData.name,
    description: item.itemData.description ?? "",
    category: { id: category.id, slug: category.slug, name: category.name },
    images: (item.itemData.imageIds ?? [])
      .map((id) => images.get(id))
      .filter((img): img is SquareCatalogImage => Boolean(img))
      .map((img) => ({ url: img.imageData.url, alt: img.imageData.caption ?? item.itemData.name })),
    variants,
    price: Math.min(...variants.map((v) => v.price)),
    currency: "USD",
    stock,
    isSold: stock === 0,
    isOneOfOne: variants.length === 1 && variants[0].stock <= 1,
    details,
    brand: attrValue(attrs.brand) ?? attrValue(attrs.brand_line),
    sizes,
    gradingCompany,
    grade: gradingCompany && grade ? `${gradingCompany} ${grade}` : grade,
    condition: attrValue(attrs.condition),
    createdAt: item.createdAt ?? item.updatedAt,
    soldAt: stock === 0 ? soldCount?.calculatedAt : undefined,
  };
}
