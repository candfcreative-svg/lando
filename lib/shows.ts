import { cacheLife } from "next/cache";
import { shows, type ShowEvent } from "@/data/shows";

/** Upcoming shows, soonest first. Re-evaluated hourly so past events drop off. */
export async function getUpcomingShows(kind?: ShowEvent["kind"]): Promise<ShowEvent[]> {
  "use cache";
  cacheLife("hours");
  const now = Date.now();
  return shows
    .filter((s) => (kind ? s.kind === kind : true))
    .filter((s) => new Date(s.end ?? s.start).getTime() >= now)
    .sort((a, b) => a.start.localeCompare(b.start));
}
