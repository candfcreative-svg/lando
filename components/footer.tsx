import Link from "next/link";
import { site } from "@/data/site";
import { LogoLink } from "./logo";
import { categoryLinks, mainLinks } from "./nav-links";

const socials = [
  { href: site.links.whatnot, label: "Whatnot" },
  { href: site.links.instagram, label: "Instagram" },
  { href: site.links.tiktok, label: "TikTok" },
  { href: site.links.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="halftone mt-auto border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <LogoLink />
          <p className="mt-4 max-w-xs text-sm text-silver">{site.tagline}</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-silver/70">Est. {site.established}</p>
        </div>

        <nav aria-label="Shop categories">
          <h2 className="display text-xl text-blaze">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categoryLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-mist hover:text-chrome">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Store information">
          <h2 className="display text-xl text-blaze">Info</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {mainLinks.slice(1).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-mist hover:text-chrome">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/faq#shipping" className="text-mist hover:text-chrome">
                Shipping &amp; returns
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="display text-xl text-blaze">Follow the rips</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-chrome hover:border-blaze hover:text-blaze"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-silver">
            <a href={`mailto:${site.email}`} className="hover:text-chrome">
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-silver sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {site.established} {site.name}. All rights reserved.</p>
          <p className="rounded bg-white/5 px-2 py-1">Demo site: products, prices, links and events are placeholders.</p>
        </div>
      </div>
    </footer>
  );
}
