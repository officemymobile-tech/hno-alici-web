import { isSanityContentEnabled, sanityReadFailed } from "./content-source";
import { fetchOpeningHoursOverlay } from "./sanity/queries";
import { defaultSchedule, type ResolvedSchedule } from "./opening-hours";

// Resolved once at build time — the exact same pattern as every other
// content loader (editable-content.ts, announcements.ts, ...): local by
// default/in production, Sanity only when CONTENT_SOURCE=sanity, with a
// try/catch fallback to local on any error. This is THE single shared
// source both the displayed hours (HoursCard) and the live "open now"
// ticker (ClinicOpenStatus) now read, closing the gap described in
// docs/migration/opening-hours-consistency-risk.md.
export let resolvedSchedule: ResolvedSchedule = defaultSchedule;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchOpeningHoursOverlay();
    if (!overlay) {
      sanityReadFailed("opening-hours (openingHours singleton missing)", new Error("fetchOpeningHoursOverlay returned null"));
    }
    resolvedSchedule = overlay;
  } catch (e) {
    sanityReadFailed("opening-hours", e);
  }
}
