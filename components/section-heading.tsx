import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  id,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-blaze">{eyebrow}</p>}
        <h2 id={id} className="display text-4xl sm:text-5xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-chrome hover:text-blaze">
          {linkLabel}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
