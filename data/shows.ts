/**
 * SHOWS & EVENTS (editable).
 *
 * Add, edit or delete entries here and redeploy. Past events hide
 * automatically. All entries below are PLACEHOLDER demo events.
 *
 * kind:
 *  - "whatnot"   live online auction/break on Whatnot
 *  - "in-person" card show, sneaker con, convention, pop-up
 */
export interface ShowEvent {
  id: string;
  kind: "whatnot" | "in-person";
  title: string;
  /** ISO date-time with offset, e.g. "2026-11-14T10:00:00-05:00" */
  start: string;
  end?: string;
  venue?: string;
  city?: string;
  /** e.g. "Booth 214" or "Table A12" */
  booth?: string;
  description: string;
  url?: string;
  featured?: boolean;
}

export const shows: ShowEvent[] = [
  {
    id: "wn-2026-11-12",
    kind: "whatnot",
    title: "Prizm Basketball Hobby Box Break",
    start: "2026-11-12T20:00:00-05:00",
    end: "2026-11-12T22:30:00-05:00",
    description: "Random-team break plus $1 starts on graded slabs between boxes.",
    featured: true,
  },
  {
    id: "ip-2026-11-15",
    kind: "in-person",
    title: "Tri-State Card & Collectibles Show",
    start: "2026-11-15T10:00:00-05:00",
    end: "2026-11-15T17:00:00-05:00",
    venue: "Convention Center, Hall B",
    city: "Your City, ST",
    booth: "Booth 214",
    description: "Full sneaker wall, graded case and a dollar bin. Cash, card and trades welcome.",
    featured: true,
  },
  {
    id: "wn-2026-11-19",
    kind: "whatnot",
    title: "Sneaker Sunday… on a Thursday",
    start: "2026-11-19T19:00:00-05:00",
    description: "Deadstock and VNDS pairs from the vault, all starting at $1.",
  },
  {
    id: "ip-2026-12-05",
    kind: "in-person",
    title: "Holiday Sneaker & Streetwear Market",
    start: "2026-12-05T11:00:00-05:00",
    end: "2026-12-06T18:00:00-05:00",
    venue: "Downtown Expo Hall",
    city: "Your City, ST",
    booth: "Table A12",
    description: "Two-day holiday market. Gift-ready grails and Ripsday merch.",
  },
  {
    id: "wn-2026-12-10",
    kind: "whatnot",
    title: "Pokémon Pack Rip Marathon",
    start: "2026-12-10T20:00:00-05:00",
    description: "Booster bundles, ETBs and chase-card giveaways all night.",
  },
  {
    id: "ip-2027-01-23",
    kind: "in-person",
    title: "Winter Card Expo",
    start: "2027-01-23T09:00:00-05:00",
    end: "2027-01-24T16:00:00-05:00",
    venue: "Fairgrounds Expo Center",
    city: "Nearby City, ST",
    booth: "Booth 88",
    description: "Biggest card show of the winter. We'll be buying collections too.",
  },
];
