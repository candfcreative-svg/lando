"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import type { FilterFacets } from "@/lib/commerce/types";
import { PRICE_PRESETS, SORT_OPTIONS } from "@/lib/shop-params";
import { categoryLinks } from "./nav-links";

type ListKey = "size" | "brand" | "grade";

function useShopParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const get = (k: string) => params.get(k) ?? "";
  const getList = (k: ListKey) => get(k).split(",").filter(Boolean);

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("focus");
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  const set = (k: string, v: string | null) => update((p) => (v ? p.set(k, v) : p.delete(k)));
  const toggle = (k: ListKey, v: string) =>
    update((p) => {
      const cur = new Set(getList(k));
      if (cur.has(v)) cur.delete(v);
      else cur.add(v);
      if (cur.size) p.set(k, [...cur].join(","));
      else p.delete(k);
    });
  const clearAll = () =>
    update((p) => {
      for (const k of ["size", "brand", "grade", "price", "availability", "q"]) p.delete(k);
    });

  return { get, getList, set, toggle, clearAll, pending, pathname };
}

/* ───────── Toolbar: search, sort, count, mobile filter button, active chips ───────── */

export function ShopToolbar({ count, facets, showCategory }: { count: number; facets: FilterFacets; showCategory: boolean }) {
  const s = useShopParams();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(s.get("q"));

  useEffect(() => {
    if (s.get("focus") === "search") searchRef.current?.focus();
    // Only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const chips: { label: string; onRemove: () => void }[] = [
    ...s.getList("size").map((v) => ({ label: `Size ${v}`, onRemove: () => s.toggle("size", v) })),
    ...s.getList("brand").map((v) => ({ label: v, onRemove: () => s.toggle("brand", v) })),
    ...s.getList("grade").map((v) => ({ label: v, onRemove: () => s.toggle("grade", v) })),
  ];
  const price = PRICE_PRESETS.find((p) => p.value === s.get("price"));
  if (price) chips.push({ label: price.label, onRemove: () => s.set("price", null) });
  if (s.get("availability") === "sold") chips.push({ label: "Sold only", onRemove: () => s.set("availability", null) });
  if (s.get("availability") === "all") chips.push({ label: "Including sold", onRemove: () => s.set("availability", null) });
  if (s.get("q")) chips.push({ label: `“${s.get("q")}”`, onRemove: () => (setQ(""), s.set("q", null)) });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <form
          role="search"
          className="relative min-w-0 flex-1 basis-full sm:basis-auto"
          onSubmit={(e) => {
            e.preventDefault();
            s.set("q", q.trim() || null);
          }}
        >
          <label htmlFor="shop-search" className="sr-only">
            Search items
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-silver" aria-hidden />
          <input
            ref={searchRef}
            id="shop-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search players, brands, sets…"
            className="h-11 w-full rounded-full bg-white/[0.06] pl-10 pr-4 text-chrome ring-1 ring-white/10 placeholder:text-silver/80 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blaze"
          />
        </form>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.06] px-4 font-semibold ring-1 ring-white/10 hover:bg-white/10 lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden /> Filters
          {chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-blaze text-xs text-ink">{chips.length}</span>}
        </button>

        <label className="relative inline-flex h-11 items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
          <span className="sr-only">Sort by</span>
          <select
            value={s.get("sort") || "newest"}
            onChange={(e) => s.set("sort", e.target.value === "newest" ? null : e.target.value)}
            className="h-full appearance-none rounded-full bg-transparent pl-4 pr-9 font-semibold text-chrome focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-ink">
                {o.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 text-silver" aria-hidden>
            ▾
          </span>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-live="polite">
        <p className={`mr-2 text-sm text-silver transition ${s.pending ? "opacity-50" : ""}`}>
          {s.pending ? "Updating…" : `${count} ${count === 1 ? "item" : "items"}`}
        </p>
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={c.onRemove}
            className="inline-flex items-center gap-1 rounded-full bg-blaze/15 px-3 py-1 text-sm font-medium text-blaze ring-1 ring-blaze/40 hover:bg-blaze/25"
            aria-label={`Remove filter ${c.label}`}
          >
            {c.label} <X className="size-3.5" aria-hidden />
          </button>
        ))}
        {chips.length > 1 && (
          <button type="button" onClick={s.clearAll} className="text-sm font-semibold text-mist underline-offset-4 hover:text-chrome hover:underline">
            Clear all
          </button>
        )}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-0 ml-auto h-dvh max-h-none w-[88vw] max-w-sm bg-ink text-chrome backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        aria-label="Filters"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="display text-3xl">Filters</h2>
            <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close filters">
              <X className="size-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel facets={facets} showCategory={showCategory} />
          </div>
          <div className="border-t border-white/10 p-4">
            <button type="button" onClick={() => setOpen(false)} className="h-12 w-full rounded-full bg-blaze font-bold text-ink hover:bg-blaze-hi">
              {s.pending ? "Updating…" : `Show ${count} ${count === 1 ? "item" : "items"}`}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/* ───────── Sidebar (desktop) ───────── */

export function FilterSidebar({ facets, showCategory }: { facets: FilterFacets; showCategory: boolean }) {
  return (
    <aside className="hidden lg:block" aria-label="Filters">
      <div className="sticky top-28">
        <FilterPanel facets={facets} showCategory={showCategory} />
      </div>
    </aside>
  );
}

/* ───────── Shared filter controls ───────── */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-white/10 pb-5 [&:not(:first-child)]:pt-5">
      <legend className="mb-3 float-left w-full text-xs font-bold uppercase tracking-[0.18em] text-silver">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`min-w-11 rounded-lg px-3 py-2 text-sm font-semibold ring-1 transition ${
        active ? "bg-blaze text-ink ring-blaze" : "bg-white/[0.04] text-chrome ring-white/15 hover:ring-blaze/60"
      }`}
    >
      {children}
    </button>
  );
}

function CheckRow({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-mist hover:text-chrome">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid size-5 shrink-0 place-items-center rounded ring-1 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blaze ${
          checked ? "bg-blaze ring-blaze" : "ring-white/30"
        }`}
        aria-hidden
      >
        {checked && <Check className="size-3.5 text-ink" strokeWidth={3} />}
      </span>
      <span className={checked ? "font-semibold text-chrome" : ""}>{children}</span>
    </label>
  );
}

function FilterPanel({ facets, showCategory }: { facets: FilterFacets; showCategory: boolean }) {
  const s = useShopParams();
  const sizes = s.getList("size");
  const brands = s.getList("brand");
  const grades = s.getList("grade");
  const availability = s.get("availability") || "available";
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? facets.brands : facets.brands.slice(0, 8);
  const qs = s.get("q") ? `?q=${encodeURIComponent(s.get("q"))}` : "";

  return (
    <div className={s.pending ? "opacity-70 transition" : "transition"}>
      {showCategory && (
        <FilterGroup title="Category">
          <ul className="space-y-0.5">
            {categoryLinks.map((c) => (
              <li key={c.href}>
                <Link href={`${c.href}${qs}`} className="block rounded-md py-1.5 text-sm text-mist hover:text-blaze">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Availability">
        <div className="flex flex-wrap gap-2">
          {[
            { v: "available", l: "Available" },
            { v: "all", l: "All" },
            { v: "sold", l: "Sold" },
          ].map((o) => (
            <Chip key={o.v} active={availability === o.v} onClick={() => s.set("availability", o.v === "available" ? null : o.v)}>
              {o.l}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="space-y-0.5">
          {PRICE_PRESETS.map((p) => (
            <CheckRow key={p.value} checked={s.get("price") === p.value} onChange={() => s.set("price", s.get("price") === p.value ? null : p.value)}>
              {p.label}
            </CheckRow>
          ))}
        </div>
      </FilterGroup>

      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <Chip key={size} active={sizes.includes(size)} onClick={() => s.toggle("size", size)} label={`Size ${size}`}>
                {size}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.grades.length > 0 && (
        <FilterGroup title="Grade">
          <div className="flex flex-wrap gap-2">
            {facets.grades.map((g) => (
              <Chip key={g} active={grades.includes(g)} onClick={() => s.toggle("grade", g)}>
                {g}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.brands.length > 0 && (
        <FilterGroup title="Brand">
          <div className="space-y-0.5">
            {visibleBrands.map((b) => (
              <CheckRow key={b} checked={brands.includes(b)} onChange={() => s.toggle("brand", b)}>
                {b}
              </CheckRow>
            ))}
          </div>
          {facets.brands.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-2 text-sm font-semibold text-blaze hover:text-blaze-hi"
              aria-expanded={showAllBrands}
            >
              {showAllBrands ? "Show fewer" : `Show all ${facets.brands.length}`}
            </button>
          )}
        </FilterGroup>
      )}
    </div>
  );
}
