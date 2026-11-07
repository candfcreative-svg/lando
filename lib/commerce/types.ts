/**
 * The app's own commerce types. Pages and components only ever see these,
 * never raw Square objects, so the backing provider can change freely.
 */

export type CategorySlug =
  | "sneakers"
  | "clothing"
  | "cards"
  | "collectibles"
  | "figures"
  | "memorabilia"
  | "art";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  productCount: number;
}

export interface ProductImage {
  url: string;
  alt: string;
}

/** A labeled spec shown on the product page, e.g. { label: "Grade", value: "10" }. */
export interface ProductDetail {
  key: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  /** "One size" for single-variation items, otherwise the size label. */
  name: string;
  sku?: string;
  price: number; // cents
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Pick<Category, "id" | "slug" | "name">;
  images: ProductImage[];
  variants: ProductVariant[];
  /** Lowest variant price, in cents. */
  price: number;
  currency: "USD";
  /** Total stock across variants. 0 means sold. */
  stock: number;
  isSold: boolean;
  /** True when the item is a single unique piece. */
  isOneOfOne: boolean;
  /** Category-specific specs, only those with a value, in display order. */
  details: ProductDetail[];
  /** Shortcuts used by filters and cards. */
  brand?: string;
  sizes: string[];
  grade?: string;
  gradingCompany?: string;
  condition?: string;
  createdAt: string;
  /** Set when the item sold (from inventory state). */
  soldAt?: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc";
export type Availability = "available" | "sold" | "all";

export interface ProductFilters {
  category?: CategorySlug;
  minPrice?: number; // cents
  maxPrice?: number; // cents
  sizes?: string[];
  brands?: string[];
  /** Matches "PSA 10", "BGS 9.5", etc. */
  grades?: string[];
  q?: string;
  availability?: Availability; // default "available"
  sort?: SortOption; // default "newest"
  limit?: number;
  /** Exclude one product (used for "related items"). */
  excludeId?: string;
}

export interface InventoryLevel {
  variantId: string;
  stock: number;
  updatedAt: string;
}

export interface CartLine {
  variantId: string;
  quantity: number;
}

export interface CheckoutLineIssue {
  variantId: string;
  reason: "sold_out" | "insufficient_stock" | "not_found";
  available: number;
}

export type CheckoutResult =
  | {
      ok: true;
      /** Square: the hosted Checkout payment link. Mock: our demo confirmation page. */
      checkoutUrl: string;
      orderId: string;
      subtotal: number;
      isDemo: boolean;
    }
  | { ok: false; issues: CheckoutLineIssue[] };

export interface FilterFacets {
  brands: string[];
  sizes: string[];
  grades: string[];
  priceRange: { min: number; max: number };
}

/** Every provider (mock, square) implements this interface. */
export interface CommerceProvider {
  name: "mock" | "square";
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getInventory(variantIds: string[]): Promise<InventoryLevel[]>;
  createCheckout(lines: CartLine[]): Promise<CheckoutResult>;
}
