import { site } from "@/data/site";

const SHOW_LENGTH_MIN = 150;

/** Next start of the weekly show, and whether it's live right now. */
export function nextWeeklyShow(now: Date = new Date()) {
  const { weekday, hour, minute, timeZone } = site.weeklyShow;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const nowDay = days.indexOf(parts.weekday);
  const nowMin = Number(parts.hour) * 60 + Number(parts.minute);
  const showMin = hour * 60 + minute;

  let daysAhead = (weekday - nowDay + 7) % 7;
  const isLive = daysAhead === 0 && nowMin >= showMin && nowMin < showMin + SHOW_LENGTH_MIN;
  if (daysAhead === 0 && nowMin >= showMin && !isLive) daysAhead = 7;

  const deltaMin = daysAhead * 1440 + (showMin - nowMin);
  const start = new Date(now.getTime() + deltaMin * 60_000 - Number(parts.second) * 1000);
  return { start, isLive };
}

export function weeklyShowLabel() {
  const { weekday, hour, minute, timeZoneLabel } = site.weeklyShow;
  const day = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"][weekday];
  const h = hour % 12 || 12;
  const m = minute ? `:${String(minute).padStart(2, "0")}` : "";
  return `${day} · ${h}${m} ${hour < 12 ? "AM" : "PM"} ${timeZoneLabel}`;
}
