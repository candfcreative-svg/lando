import Image, { type ImageProps } from "next/image";

/** next/image that skips optimization for local SVG placeholders. */
export function ProductImage(props: ImageProps & { src: string }) {
  const isSvg = props.src.endsWith(".svg");
  return <Image {...props} unoptimized={isSvg || props.unoptimized} alt={props.alt} />;
}
