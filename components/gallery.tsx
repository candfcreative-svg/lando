"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { ProductImage as Img } from "@/lib/commerce/types";
import { SoldStamp } from "./badges";
import { ProductImage } from "./product-image";

export function Gallery({ images, sold }: { images: Img[]; sold: boolean }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [lbZoom, setLbZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const current = images[index];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (lightbox && !d.open) d.showModal();
    if (!lightbox && d.open) d.close();
  }, [lightbox]);

  const go = (i: number) => {
    const n = (i + images.length) % images.length;
    setIndex(n);
    // Keep the mobile swipe strip in sync.
    strip.current?.scrollTo({ left: n * strip.current.clientWidth, behavior: "smooth" });
  };

  if (!current) return null;

  return (
    <div>
      {/* Desktop: hover-to-zoom main image */}
      <div className="relative hidden aspect-square overflow-hidden rounded-2xl bg-paper shadow-lift md:block">
        <button
          type="button"
          className="absolute inset-0 cursor-zoom-in"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
          aria-label="Open full-screen image viewer"
        >
          <ProductImage
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </button>
        {sold && <SoldStamp size="lg" />}
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-chrome">
          <ZoomIn className="size-3.5" aria-hidden /> Hover to zoom · click to expand
        </span>
      </div>

      {/* Mobile: swipeable strip */}
      <div className="relative md:hidden">
        <div
          ref={strip}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
          aria-roledescription="carousel"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setLightbox(true)}
              className="relative aspect-square w-full shrink-0 snap-center bg-paper"
              aria-label={`Image ${i + 1} of ${images.length}, tap to zoom`}
            >
              <ProductImage src={img.url} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {sold && <SoldStamp size="lg" />}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
          {images.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-blaze" : "w-1.5 bg-ink/40"}`} />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((img, i) => (
          <li key={img.url}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-paper ring-2 transition ${
                i === index ? "ring-blaze" : "ring-transparent hover:ring-white/30"
              }`}
            >
              <ProductImage src={img.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      <dialog
        ref={dialog}
        onClose={() => {
          setLightbox(false);
          setLbZoom(false);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-chrome backdrop:bg-black/80"
        aria-label="Image viewer"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-3">
            <p className="px-2 text-sm text-silver">
              {index + 1} / {images.length}
            </p>
            <button type="button" onClick={() => setLightbox(false)} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close image viewer">
              <X className="size-6" />
            </button>
          </div>
          <div className="relative flex-1 overflow-auto">
            <button
              type="button"
              onClick={() => setLbZoom((z) => !z)}
              className={`relative mx-auto block aspect-square ${lbZoom ? "w-[200vmin] max-w-none cursor-zoom-out" : "h-full max-h-[80vh] max-w-full cursor-zoom-in"}`}
              aria-label={lbZoom ? "Zoom out" : "Zoom in"}
            >
              <ProductImage src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </button>
            {images.length > 1 && !lbZoom && (
              <>
                <button type="button" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/80 hover:bg-ink" aria-label="Previous image">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/80 hover:bg-ink" aria-label="Next image">
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
          <p className="p-3 text-center text-xs text-silver">{lbZoom ? "Tap to zoom out · scroll to pan" : "Tap the image to zoom"}</p>
        </div>
      </dialog>
    </div>
  );
}
