export function SoldStamp({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/35" aria-hidden>
      <span
        className={`display -rotate-12 rounded-md border-4 border-sold bg-paper/90 text-sold shadow-lg ${
          size === "lg" ? "px-8 py-2 text-6xl" : "px-4 py-1 text-3xl"
        }`}
      >
        Sold
      </span>
    </div>
  );
}

export function Pill({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "blaze" | "chrome" | "sold" }) {
  const tones = {
    ink: "bg-ink/85 text-chrome",
    blaze: "bg-blaze text-ink",
    chrome: "bg-chrome text-ink",
    sold: "bg-sold text-white",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}
