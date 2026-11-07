import Link from "next/link";
import { site } from "@/data/site";
import { weeklyShowLabel } from "@/lib/weekly";
import { Countdown } from "./countdown";

export function LiveBar() {
  return (
    <div className="bg-blaze text-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-[13px] font-semibold sm:text-sm">
        <span className="relative flex size-2.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink/60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-ink" />
        </span>
        <span className="truncate">
          <span className="display mr-1 text-base not-italic tracking-wide">{site.weeklyShow.name}</span>
          <span className="hidden sm:inline">{weeklyShowLabel()} on Whatnot</span>
        </span>
        <Countdown className="hidden tabular-nums md:inline" variant="inline" />
        <Link
          href={site.links.whatnot}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-ink px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-chrome hover:bg-ink-2"
        >
          Watch<span className="sr-only"> on Whatnot (opens in a new tab)</span>
        </Link>
      </div>
    </div>
  );
}
