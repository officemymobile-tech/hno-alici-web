import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * CSS `object-position` string derived from a Sanity image's hotspot (set by
 * an editor in Studio via the image field's focal-point picker — requires
 * `options: { hotspot: true }` on that schema field). Returns undefined when
 * no hotspot is set (e.g. an image uploaded before this feature existed, or
 * one where the editor never adjusted the default center point) so callers
 * can fall back to their existing fixed `object-position` class untouched.
 */
export function hotspotPosition(source: unknown): string | undefined {
  const hotspot = (source as { hotspot?: { x?: number; y?: number } } | null | undefined)?.hotspot;
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") return undefined;
  return `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`;
}
