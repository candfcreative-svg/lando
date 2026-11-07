import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Radio, ShieldCheck, Truck } from "lucide-react";
import logo from "@/public/brand/lando-ripsday-logo.jpg";
import { Countdown } from "@/components/countdown";
import { ProductCard, ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { SectionHeading } from "@/components/section-heading";
import { ShowCard } from "@/components/show-card";
import { site } from "@/data/site";
import { getCategories, getProducts } from "@/lib/commerce";
import { getUpcomingShows } from "@/lib/shows";
import { weeklyShowLabel } from "@/lib/weekly";

const TICKER = ["Sneakers", "Graded slabs", "Pokémon", "Sealed wax", "Streetwear", "Vintage", "Figures", "Autographs", "Art", "1 of 1s"];

export default async function HomePage() {
  const [newArrivals, recentlySold, categories, allAvailable, whatnotShows, inPersonShows] = await Promise.all([
    getProducts({ sort: "newest", limit: 8 }),
    getProducts({ availability: "sold", limit: 6 }),
    getCategories(),
    getProducts(),
    getUpcomingShows("whatnot"),
    getUpcomingShows("in-person"),
  ]);
  const coverFor = (slug: string) => allAvailable.find((p) => p.category.slug === slug)?.images[0];

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="tear-bottom relative overflow-hidden [--tear-color:var(--color-blaze)]" aria-labelledby="hero-title">
        <div className="stadium-glow absolute inset-0" aria-hidden />
        <div className="halftone absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-14">
          <div className="order-2 md:order-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blaze ring-1 ring-white/10">
              <Radio className="size-3.5" aria-hidden /> Live every week · Est. {site.established}
            </p>
            <h1 id="hero-title" className="display mt-4 text-[3.4rem] sm:text-7xl lg:text-8xl">
              <span className="text-chrome-grad">One-of-one heat.</span>
              <br />
              <span className="text-blaze">Ripped live.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-mist">
              Sneakers, graded cards, collectibles, memorabilia and art. Most pieces are one of a kind, so when it&apos;s gone,
              it&apos;s gone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-blaze px-6 font-bold text-ink shadow-[0_8px_30px_-8px_rgb(244_116_27/0.7)] transition hover:bg-blaze-hi"
              >
                Shop new arrivals <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={site.links.whatnot}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-bold text-chrome ring-2 ring-chrome/30 transition hover:ring-blaze"
              >
                Watch on Whatnot<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <ul className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-xs text-mist sm:text-sm">
              <li className="flex items-center gap-2">
                <BadgeCheck className="size-5 shrink-0 text-blaze" aria-hidden /> Hand-checked
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-5 shrink-0 text-blaze" aria-hidden /> Authenticated
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-5 shrink-0 text-blaze" aria-hidden /> Ships in {site.shipping.handlingDays.split(" ")[0]} days
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src={logo}
              alt={`${site.name}, est. ${site.established}`}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="mx-auto w-full max-w-[560px] [mask-image:radial-gradient(closest-side,black_78%,transparent)]"
            />
          </div>
        </div>
      </section>

      {/* ───────── Ticker ───────── */}
      <div className="overflow-hidden bg-blaze py-3 text-ink" aria-hidden>
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="display flex items-center gap-8 text-2xl">
              {t} <span className="text-ink/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────── New arrivals ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="new-title">
        <SectionHeading id="new-title" eyebrow="Fresh off the table" title="New arrivals" href="/shop" />
        <ProductGrid products={newArrivals} priorityCount={4} />
      </section>

      {/* ───────── Categories ───────── */}
      <section className="bg-ink-2 py-16 sm:py-20" aria-labelledby="cat-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="cat-title" eyebrow="Dig in" title="Shop by category" />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {categories.map((c, i) => {
              const cover = coverFor(c.slug);
              return (
                <li key={c.id} className={i === 0 ? "col-span-2 md:row-span-2" : i >= 5 ? "md:col-span-2" : ""}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="group relative block h-full overflow-hidden rounded-2xl bg-paper ring-1 ring-black/5"
                  >
                    <div className={`relative ${i === 0 ? "aspect-[2/1] md:aspect-auto md:h-full md:min-h-[420px]" : i >= 5 ? "aspect-square md:aspect-[2/1]" : "aspect-square"}`}>
                      {cover && (
                        <ProductImage
                          src={cover.url}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className={`display text-chrome ${i === 0 ? "text-5xl sm:text-6xl" : "text-3xl"}`}>{c.name}</h3>
                        <p className="mt-0.5 text-sm font-medium text-mist">
                          {c.productCount} available <span className="text-blaze transition group-hover:ml-1">→</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────── Weekly Ripsday + Whatnot ───────── */}
      <section className="relative overflow-hidden py-16 sm:py-20" aria-labelledby="live-title">
        <div className="halftone-orange absolute -right-20 top-0 h-full w-1/2 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-blaze to-blaze-lo p-1">
            <div className="h-full rounded-[1.35rem] bg-ink p-6 sm:p-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blaze">
                <span className="size-2 animate-pulse rounded-full bg-blaze" aria-hidden /> Weekly live show
              </p>
              <h2 id="live-title" className="display mt-3 text-5xl sm:text-6xl">
                <span className="text-chrome-grad">{site.weeklyShow.name}</span>
              </h2>
              <p className="mt-2 text-lg font-semibold text-chrome">{weeklyShowLabel()}</p>
              <p className="mt-3 text-mist">
                Pack rips, hobby box breaks and $1-start auctions on sneakers and slabs, live on Whatnot every week.
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-silver">Next show starts in</p>
              <Countdown variant="blocks" className="mt-2" />
              <a
                href={site.links.whatnot}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-blaze px-6 font-bold text-ink transition hover:bg-blaze-hi"
              >
                Follow on Whatnot <ArrowRight className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="On the schedule" title="Upcoming Whatnot shows" href="/shows" linkLabel="All shows" />
            <ul className="space-y-3">
              {whatnotShows.slice(0, 3).map((s) => (
                <li key={s.id}>
                  <ShowCard show={s} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Recently sold ───────── */}
      <section className="bg-ink-2 py-16 sm:py-20" aria-labelledby="sold-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="sold-title" eyebrow="You snooze, you lose" title="Recently sold" href="/shop?availability=sold" linkLabel="See all sold" />
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {recentlySold.map((p) => (
              <li key={p.id} className="w-[44vw] shrink-0 snap-start sm:w-auto">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── In-person shows ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="shows-title">
        <SectionHeading id="shows-title" eyebrow="Come see the wall" title="Find us at shows" href="/shows" linkLabel="Full schedule" />
        <ul className="grid gap-4 md:grid-cols-3">
          {inPersonShows.slice(0, 3).map((s) => (
            <li key={s.id}>
              <ShowCard show={s} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-silver">
          Cash, card and trades welcome at every show. Want something held for pickup?{" "}
          <Link href="/contact" className="font-semibold text-blaze hover:text-blaze-hi">
            Message us
          </Link>
          .
        </p>
      </section>
    </>
  );
}
