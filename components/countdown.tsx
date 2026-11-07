"use client";

import { useEffect, useState } from "react";
import { nextWeeklyShow } from "@/lib/weekly";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live countdown to the next weekly show. Renders nothing until mounted (no hydration mismatch). */
export function Countdown({ className = "", variant = "inline" }: { className?: string; variant?: "inline" | "blocks" }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the clock after mount
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return variant === "blocks" ? <div className={`h-[74px] ${className}`} aria-hidden /> : null;
  }

  const { start, isLive } = nextWeeklyShow(now);
  const t = parts(start.getTime() - now.getTime());

  if (isLive) {
    return (
      <span className={`${className} font-bold uppercase`} role="status">
        Live now
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span className={className} aria-label={`Starts in ${t.d} days ${t.h} hours ${t.m} minutes`}>
        · starts in {t.d > 0 && `${t.d}d `}
        {String(t.h).padStart(2, "0")}h {String(t.m).padStart(2, "0")}m {String(t.s).padStart(2, "0")}s
      </span>
    );
  }

  const blocks = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hrs" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Sec" },
  ];
  return (
    <div className={`flex gap-2 ${className}`} aria-label={`Starts in ${t.d} days ${t.h} hours ${t.m} minutes`} role="timer">
      {blocks.map((b) => (
        <div key={b.l} className="min-w-16 rounded-lg bg-ink/70 px-3 py-2 text-center ring-1 ring-white/10">
          <div className="display text-3xl not-italic tabular-nums text-chrome">{String(b.v).padStart(2, "0")}</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-silver">{b.l}</div>
        </div>
      ))}
    </div>
  );
}
