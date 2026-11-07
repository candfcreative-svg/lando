/**
 * Square-shaped catalog and inventory types.
 *
 * These mirror the objects returned by Square's Catalog API
 * (`/v2/catalog/list`, `/v2/catalog/search`) and Inventory API
 * (`/v2/inventory/counts/batch-retrieve`), trimmed to the fields this store uses.
 * Field names are camelCase, which is how the official `square` Node SDK
 * returns them.
 *
 * The mock data in `data/catalog.ts` is written in exactly this shape, so the
 * same mapper (`lib/commerce/mapper.ts`) turns either mock data or live Square
 * data into the app's `Product` type. Swapping providers changes no pages.
 *
 * Reference: https://developer.squareup.com/reference/square/objects/CatalogObject
 */

/** Square stores money as integer minor units (cents) plus a currency code. */
export interface SquareMoney {
  amount: number; // The SDK returns bigint; the Square provider converts to number.
  currency: "USD";
}

export interface SquareCatalogCategory {
  type: "CATEGORY";
  id: string;
  updatedAt: string;
  categoryData: {
    name: string;
    /** Used by this store to build URLs like /shop/sneakers. */
    ecomSeoData?: { permalink?: string; pageTitle?: string; pageDescription?: string };
  };
}

export interface SquareCatalogImage {
  type: "IMAGE";
  id: string;
  imageData: {
    name?: string;
    url: string;
    caption?: string;
  };
}

/**
 * A custom attribute value on an item. In Square, each key is defined once by a
 * CUSTOM_ATTRIBUTE_DEFINITION object (seller-visible fields like "Grade").
 */
export interface SquareCustomAttributeValue {
  name: string;
  key: string;
  type: "STRING" | "NUMBER" | "BOOLEAN" | "SELECTION";
  stringValue?: string;
  numberValue?: string; // Square sends NUMBER values as strings.
  booleanValue?: boolean;
}

export interface SquareCatalogItemVariation {
  type: "ITEM_VARIATION";
  id: string;
  updatedAt: string;
  itemVariationData: {
    itemId: string;
    /** For sneakers and clothing this is the size, e.g. "10" or "L". */
    name: string;
    sku?: string;
    ordinal?: number;
    pricingType: "FIXED_PRICING";
    priceMoney: SquareMoney;
    trackInventory: boolean;
    sellable?: boolean;
    stockable?: boolean;
  };
}

export interface SquareCatalogItem {
  type: "ITEM";
  id: string;
  /** Not on every Square API version; the provider falls back to updatedAt. */
  createdAt?: string;
  updatedAt: string;
  isDeleted?: boolean;
  presentAtAllLocations?: boolean;
  customAttributeValues?: Record<string, SquareCustomAttributeValue>;
  itemData: {
    name: string;
    description?: string;
    descriptionHtml?: string;
    productType: "REGULAR";
    categories?: { id: string; ordinal?: number }[];
    reportingCategory?: { id: string };
    imageIds?: string[];
    variations: SquareCatalogItemVariation[];
    isArchived?: boolean;
    /** Square Online visibility. "UNINDEXED" hides from search but not direct links. */
    ecomVisibility?: "UNINDEXED" | "UNAVAILABLE" | "HIDDEN" | "VISIBLE";
    ecomSeoData?: { permalink?: string; pageTitle?: string; pageDescription?: string };
    channels?: string[];
  };
}

export type SquareCatalogObject =
  | SquareCatalogItem
  | SquareCatalogCategory
  | SquareCatalogImage;

/** One row from Inventory API `BatchRetrieveInventoryCounts`. */
export interface SquareInventoryCount {
  catalogObjectId: string; // variation id
  catalogObjectType: "ITEM_VARIATION";
  state: "IN_STOCK" | "SOLD" | "WASTE" | "RETURNED_BY_CUSTOMER";
  locationId: string;
  quantity: string; // Square sends quantities as decimal strings.
  calculatedAt: string;
}
