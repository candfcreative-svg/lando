import { MapPin, Radio } from "lucide-react";
import type { ShowEvent } from "@/data/shows";
import { site } from "@/data/site";
import { formatDate, formatTime } from "@/lib/format";

export function ShowDate({ iso, end }: { iso: string; end?: string }) {
  const multiDay = end && formatDate(end) !== formatDate(iso);
  return (
    <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-chrome py-2 text-ink">
      <span className="text-[11px] font-bold uppercase tracking-widest text-blaze-lo">{formatDate(iso, { month: "short" })}</span>
      <span className="display text-3xl not-italic leading-none">
        {formatDate(iso, { day: "numeric" })}
        {multiDay && <span className="text-lg">–{formatDate(end!, { day: "numeric" })}</span>}
      </span>
      <span className="text-[11px] font-semibold uppercase text-ink/70">{formatDate(iso, { weekday: "short" })}</span>
    </div>
  );
}

export function ShowCard({ show }: { show: ShowEvent }) {
  const isWhatnot = show.kind === "whatnot";
  return (
    <article className="flex gap-4 rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
      <ShowDate iso={show.start} end={show.end} />
      <div className="min-w-0 flex-1">
        <p className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${isWhatnot ? "text-blaze" : "text-mist"}`}>
          {isWhatnot ? <Radio className="size-3.5" aria-hidden /> : <MapPin className="size-3.5" aria-hidden />}
          {isWhatnot ? "Live on Whatnot" : "In person"}
        </p>
        <h3 className="mt-1 font-semibold leading-snug text-chrome">{show.title}</h3>
        <p className="mt-1 text-sm text-silver">
          {formatTime(show.start)}
          {!isWhatnot && show.venue && (
            <>
              {" "}
              · {show.venue}, {show.city}
              {show.booth && <span className="font-semibold text-chrome"> · {show.booth}</span>}
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-mist">{show.description}</p>
        {isWhatnot && (
          <a
            href={show.url ?? site.links.whatnot}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-blaze hover:text-blaze-hi"
          >
            Set a reminder on Whatnot →<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
