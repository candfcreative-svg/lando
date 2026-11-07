/**
 * Store-wide settings. Everything marked PLACEHOLDER is demo content to be
 * replaced with the client's real details.
 */
export const site = {
  name: "Lando Ripsday",
  shortName: "Ripsday",
  established: 2026,
  tagline: "Sneakers, cards & collectibles. Ripped live every week.",
  description:
    "Lando Ripsday is a one-of-a-kind shop for sneakers, streetwear, graded cards, collectibles, figures, memorabilia and art. Shop online, catch us live on Whatnot, or find us at a show near you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "United States", // PLACEHOLDER: home city/state
  email: "hello@landoripsday.example", // PLACEHOLDER
  phone: "(555) 012-3456", // PLACEHOLDER
  currency: "USD" as const,

  /** The recurring live show the logo's "WEEKLY" calendar refers to. PLACEHOLDER day/time. */
  weeklyShow: {
    name: "Ripsday Live",
    weekday: 2, // 0 = Sunday … 2 = Tuesday
    hour: 20, // 8 PM
    minute: 0,
    timeZone: "America/New_York",
    timeZoneLabel: "ET",
  },

  /** PLACEHOLDER links. Set NEXT_PUBLIC_WHATNOT_URL etc. or edit here. */
  links: {
    whatnot: process.env.NEXT_PUBLIC_WHATNOT_URL ?? "https://www.whatnot.com/user/YOUR-WHATNOT-HANDLE",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/YOUR-HANDLE",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/@YOUR-HANDLE",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/@YOUR-HANDLE",
  },

  shipping: {
    freeOver: 150, // dollars. PLACEHOLDER policy
    flatRate: 9.95,
    handlingDays: "1–2 business days",
  },
};

export type Site = typeof site;
