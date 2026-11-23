import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  // `priority` is deprecated as of Next.js 16 in favor of `preload` (emits
  // the <link rel="preload">) — but `preload` alone does NOT set the actual
  // fetchpriority attribute; that's the separate `fetchPriority` prop, which
  // the LCP element itself also needs for Lighthouse's "LCP request
  // discovery" check to pass. See node_modules/next/dist/docs/.../image.md.
  // `priority` kept so any untouched call site doesn't break.
  priority?: boolean;
  preload?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  // CSS `object-position` value (e.g. "62% 18%"), derived from a Sanity
  // image's hotspot — see lib/sanity/image.ts's `hotspotPosition()`. When
  // set, it overrides the className's `object-top`/`object-center` etc. for
  // this exact image, so an editor-chosen focal point actually takes effect
  // instead of the previous fixed crop. Undefined (the default, e.g. for any
  // local/non-Sanity image) changes nothing — `object-fit` and `object-cover`
  // class-driven cropping behave exactly as before.
  objectPosition?: string;
};

export function SiteImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  priority,
  preload,
  fetchPriority,
  sizes,
  objectPosition,
}: SiteImageProps) {
  const style = objectPosition ? { objectPosition } : undefined;
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        style={style}
        priority={priority}
        preload={preload}
        fetchPriority={fetchPriority}
        sizes={sizes ?? "100vw"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      style={style}
      priority={priority}
      preload={preload}
      fetchPriority={fetchPriority}
      sizes={sizes}
    />
  );
}
