import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { LogoLink } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { categoryLinks } from "./nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-teal/90 backdrop-blur-md supports-[backdrop-filter]:bg-teal/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-[72px] sm:px-6">
        <MobileMenu />
        <LogoLink />

        <nav aria-label="Categories" className="ml-6 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/shop" className="rounded-md px-3 py-2 text-sm font-semibold text-chrome hover:bg-white/5 hover:text-blaze">
                Shop all
              </Link>
            </li>
            {categoryLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-md px-2.5 py-2 text-sm font-medium text-mist hover:bg-white/5 hover:text-blaze">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shows" className="rounded-md px-2.5 py-2 text-sm font-medium text-mist hover:bg-white/5 hover:text-blaze">
                Shows
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/shop?focus=search" className="grid size-11 place-items-center rounded-full text-chrome hover:bg-white/10" aria-label="Search the shop">
            <Search className="size-5" />
          </Link>
          <Link href="/cart" className="relative grid size-11 place-items-center rounded-full text-chrome hover:bg-white/10" aria-label="Cart">
            <ShoppingBag className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
