/**
 * TEMPORARY Phase A page: proves the data layer works end to end.
 * Replaced by the real home page in Phase B.
 */
import { getCategories, getFacets, getProducts, getProviderName } from "@/lib/commerce";

const usd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default async function DataCheckPage() {
  const [categories, products, facets] = await Promise.all([
    getCategories(),
    getProducts({ availability: "all" }),
    getFacets(),
  ]);
  const sold = products.filter((p) => p.isSold);

  return (
    <main className="mx-auto max-w-6xl p-6 font-sans text-sm">
      <h1 className="text-2xl font-bold">Lando Ripsday: data layer check</h1>
      <p className="mt-1 text-neutral-600">
        Provider: <b>{getProviderName()}</b> · {products.length} items · {sold.length} sold ·{" "}
        {categories.length} categories
      </p>

      <h2 className="mt-6 font-semibold">Categories (available items)</h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c.id} className="rounded border px-2 py-1">
            {c.name}: {c.productCount}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold">Filter facets</h2>
      <p>Brands: {facets.brands.join(", ")}</p>
      <p>Sizes: {facets.sizes.join(", ")}</p>
      <p>Grades: {facets.grades.join(", ")}</p>
      <p>
        Price range: {usd(facets.priceRange.min)} to {usd(facets.priceRange.max)}
      </p>

      <h2 className="mt-6 font-semibold">All items (newest first)</h2>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-1">Item</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b align-top">
              <td className="py-1 pr-2">{p.name}</td>
              <td className="pr-2">{p.category.name}</td>
              <td className="pr-2">{usd(p.price)}</td>
              <td className="pr-2">
                {p.isSold ? <b className="text-red-600">SOLD</b> : p.variants.map((v) => `${v.name}: ${v.stock}`).join(", ")}
              </td>
              <td className="text-neutral-600">{p.details.map((d) => `${d.label}: ${d.value}`).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
