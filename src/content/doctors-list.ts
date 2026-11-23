import { doctors as localDoctorsRaw, images } from "./site-content";
import { isSanityContentEnabled, sanityReadFailed } from "@/lib/content-source";
import { fetchDoctors } from "@/lib/sanity/queries";
import { getEditableImage, getEditableImagePosition } from "@/lib/editable-content";

export type DoctorListEntry = {
  name: string;
  title: { de: string; tr: string };
  primary: boolean;
  // null = no verified real photo exists yet — render an initials avatar,
  // never a generic/stand-in photo (same rule documented in DoctorsSection.tsx
  // and team/page.tsx for Dr. Benjamin Alici).
  photo: string | null;
  photoPosition?: string;
};

// Each doctor's current, already-approved real photo — resolved the same way
// it always has been (siteSettings.editableImages), kept as the fallback so
// nothing changes visually until a doctor's own Sanity document sets its own
// `portrait` field.
const localDoctors: DoctorListEntry[] = localDoctorsRaw.map((d) => ({
  name: d.name,
  title: d.title,
  primary: d.primary,
  photo:
    d.name === "Dr. Ümit Alici"
      ? getEditableImage("drAliciPortrait", images.drAliciPortrait)
      : d.name === "Dr. Sigrid Meier"
        ? getEditableImage("drMeierPortrait", images.drMeierPortrait)
        : null,
  photoPosition:
    d.name === "Dr. Ümit Alici"
      ? getEditableImagePosition("drAliciPortrait")
      : d.name === "Dr. Sigrid Meier"
        ? getEditableImagePosition("drMeierPortrait")
        : undefined,
}));

// Resolved once at build time — same pattern as every other content overlay
// in this project. Matched by exact name (not a stable ID, since the
// existing local doctors have no ID field) — a Sanity `doctor` document
// whose name matches a local entry overrides that entry's title/photo; a
// Sanity-only doctor (new name, not in the local list) is appended, same
// append-on-new-slug behavior as blogPosts.
export let doctorsList: DoctorListEntry[] = localDoctors;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchDoctors();
    if (!overlay.length) {
      sanityReadFailed("doctors-list (fetchDoctors returned 0 documents)", new Error("expected at least 1 doctor document"));
    }
    const byName = new Map(localDoctors.map((d) => [d.name, d]));
    for (const d of overlay) {
      const existing = byName.get(d.name);
      byName.set(d.name, {
        name: d.name,
        title: d.clinicalTitle ?? existing?.title ?? { de: "", tr: "" },
        primary: d.isPrimary,
        photo: d.portrait ?? existing?.photo ?? null,
        photoPosition: d.portrait ? d.portraitPosition : existing?.photoPosition,
      });
    }
    doctorsList = [...byName.values()].sort((a, b) => Number(b.primary) - Number(a.primary));
  } catch (e) {
    sanityReadFailed("doctors-list", e);
  }
}
