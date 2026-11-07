/**
 * Builds the mock catalog in Square's exact shape from `data/products.ts`.
 *
 * Output mirrors what the Square provider will receive from:
 *   - Catalog API  `ListCatalog` (types=ITEM,CATEGORY,IMAGE)
 *   - Inventory API `BatchRetrieveInventoryCounts`
 */
import type {
  SquareCatalogCategory,
  SquareCatalogImage,
  SquareCatalogItem,
  SquareCustomAttributeValue,
  SquareInventoryCount,
} from "@/lib/commerce/square-types";
import type { CategorySlug } from "@/lib/commerce/types";
import { productSeeds } from "./products";

export const MOCK_LOCATION_ID = "LMOCKMAINSTORE";

/** Fixed "today" for the demo so dates never drift between builds. */
const DEMO_NOW = Date.UTC(2026, 10, 7, 18, 0, 0);
const daysAgo = (d: number) => new Date(DEMO_NOW - d * 86_400_000).toISOString();

export const CATEGORY_INFO: Record<CategorySlug, { name: string; description: string }> = {
  sneakers: { name: "Sneakers", description: "Grails, heat and daily beaters. Deadstock to well-loved, all checked by hand." },
  clothing: { name: "Clothing", description: "Streetwear drops, vintage finds and official Ripsday merch." },
  cards: { name: "Cards", description: "Graded slabs and raw pulls across sports, Pokémon and more." },
  collectibles: { name: "Collectibles", description: "Sealed wax, Pops, die-cast and the stuff you never open." },
  figures: { name: "Figures", description: "Sixth-scale, vintage and anime figures for the shelf." },
  memorabilia: { name: "Memorabilia", description: "Authenticated autographs and sports memorabilia." },
  art: { name: "Art", description: "Originals, prints and customs from artists in the culture." },
};

const ATTRIBUTE_NAMES: Record<string, string> = {
  brand: "Brand",
  model: "Model",
  colorway: "Colorway",
  condition: "Condition",
  box_included: "Box included",
  player: "Player / Character",
  set: "Set",
  year: "Year",
  card_number: "Card number",
  grading_company: "Grading company",
  grade: "Grade",
  cert_number: "Cert number",
  brand_line: "Brand / Line",
  in_box: "In box",
  coa_source: "COA source",
  signed_by: "Signed by",
  artist: "Artist",
  medium: "Medium",
  dimensions: "Dimensions",
};

export const mockCategories: SquareCatalogCategory[] = (Object.keys(CATEGORY_INFO) as CategorySlug[]).map(
  (slug) => ({
    type: "CATEGORY",
    id: `CAT_${slug.toUpperCase()}`,
    updatedAt: daysAgo(60),
    categoryData: {
      name: CATEGORY_INFO[slug].name,
      ecomSeoData: { permalink: slug, pageDescription: CATEGORY_INFO[slug].description },
    },
  }),
);

export const mockImages: SquareCatalogImage[] = [];
export const mockItems: SquareCatalogItem[] = [];
export const mockInventory: SquareInventoryCount[] = [];

const IMAGES_PER_ITEM = 3;
const VIEW_NAMES = ["Front", "Angle", "Detail"];

for (const seed of productSeeds) {
  const itemId = `ITEM_${seed.id.toUpperCase().replace("-", "")}`;

  const imageIds: string[] = [];
  for (let i = 1; i <= IMAGES_PER_ITEM; i++) {
    const id = `${itemId}_IMG${i}`;
    imageIds.push(id);
    mockImages.push({
      type: "IMAGE",
      id,
      imageData: {
        url: `/placeholders/products/${seed.slug}-${i}.svg`,
        caption: `${seed.name}, ${VIEW_NAMES[i - 1].toLowerCase()} view (placeholder image)`,
      },
    });
  }

  const variantSeeds = seed.variants ?? [
    { name: seed.size ?? "Regular", stock: seed.stock ?? 1, price: seed.price },
  ];

  const variations = variantSeeds.map((v, idx) => {
    const id = `${itemId}_VAR${idx + 1}`;
    const updatedAt = daysAgo(seed.addedDaysAgo);
    mockInventory.push({
      catalogObjectId: id,
      catalogObjectType: "ITEM_VARIATION",
      state: "IN_STOCK",
      locationId: MOCK_LOCATION_ID,
      quantity: String(v.stock),
      calculatedAt: daysAgo(seed.soldDaysAgo ?? seed.addedDaysAgo),
    });
    if (v.stock === 0 && seed.soldDaysAgo !== undefined) {
      mockInventory.push({
        catalogObjectId: id,
        catalogObjectType: "ITEM_VARIATION",
        state: "SOLD",
        locationId: MOCK_LOCATION_ID,
        quantity: "1",
        calculatedAt: daysAgo(seed.soldDaysAgo),
      });
    }
    return {
      type: "ITEM_VARIATION" as const,
      id,
      updatedAt,
      itemVariationData: {
        itemId,
        name: v.name,
        sku: `LR-${seed.id.toUpperCase()}${variantSeeds.length > 1 ? `-${v.name}` : ""}`,
        ordinal: idx,
        pricingType: "FIXED_PRICING" as const,
        priceMoney: { amount: Math.round((v.price ?? seed.price) * 100), currency: "USD" as const },
        trackInventory: true,
        sellable: true,
        stockable: true,
      },
    };
  });

  const customAttributeValues: Record<string, SquareCustomAttributeValue> = {};
  for (const [key, value] of Object.entries(seed.attrs)) {
    customAttributeValues[key] =
      typeof value === "boolean"
        ? { name: ATTRIBUTE_NAMES[key] ?? key, key, type: "BOOLEAN", booleanValue: value }
        : { name: ATTRIBUTE_NAMES[key] ?? key, key, type: "STRING", stringValue: value };
  }

  mockItems.push({
    type: "ITEM",
    id: itemId,
    createdAt: daysAgo(seed.addedDaysAgo),
    updatedAt: daysAgo(seed.soldDaysAgo ?? seed.addedDaysAgo),
    presentAtAllLocations: true,
    customAttributeValues,
    itemData: {
      name: seed.name,
      description: seed.description,
      productType: "REGULAR",
      categories: [{ id: `CAT_${seed.category.toUpperCase()}` }],
      reportingCategory: { id: `CAT_${seed.category.toUpperCase()}` },
      imageIds,
      variations,
      ecomVisibility: "VISIBLE",
      ecomSeoData: { permalink: seed.slug },
      channels: ["ONLINE_STORE", "POINT_OF_SALE"],
    },
  });
}
