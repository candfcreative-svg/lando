"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { categoryLinks, mainLinks } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Close on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="-ml-2 grid size-11 place-items-center rounded-full text-chrome hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-6" />
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-0 h-dvh max-h-none w-[85vw] max-w-sm bg-ink text-chrome backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        aria-label="Menu"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="display text-2xl">
              <span className="text-chrome-grad">Lando</span> <span className="text-blaze">Ripsday</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close menu">
              <X className="size-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-silver">Shop</p>
            <ul className="mb-6 grid grid-cols-2 gap-2">
              {categoryLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-lg bg-white/5 px-3 py-3 font-semibold hover:bg-white/10 hover:text-blaze">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {mainLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="display block py-2 text-3xl hover:text-blaze">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
