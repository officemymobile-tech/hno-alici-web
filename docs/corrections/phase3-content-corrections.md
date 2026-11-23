# Phase 3 — Content & Code Corrections

**Status update (2026-11-21):** Items 1 (D), 2 (A), 3 (F), 5 (H, I) were reviewed and approved per-item by the user and have been **applied** on branch `cms/phase2-4-audit-sanity` (local only — not pushed, not merged, not deployed). Item 4 (G, color contrast) and item 6 (C, orphaned legal JSON files) are **still pending** — not yet applied, see their sections below.

---

### 1. "Online Termin" / "Online Randevu" wording (Finding D) — APPLIED

**File:** `messages/de.json:199`, `messages/tr.json:199`

| | Before | After (applied, user-specified exact text) |
|---|---|---|
| DE `appointment.title` | `"Online Termin"` | `"Terminanfrage senden"` |
| TR `appointment.title` | `"Online Randevu"` | `"Randevu Talebi Gönder"` |

**Rationale:** The page only offers a `mailto:` link (`AppointmentForm.tsx`) and phone contact — there is no real online booking engine. The new title names the actual action (sending a request), not an instant booking.

**Verification that no other text overclaims an instant confirmed booking:** Reviewed `AppointmentForm.tsx` end to end — the `thanks` message explicitly says staff will call back ("Wir melden uns schnellstmöglich telefonisch bei Ihnen." / "En kısa sürede sizi arayacağız."), the submit button reads "Anfrage senden"/"Talep gönder" ("send request"), and the `note` line says phone is preferred for faster handling. None of this promises an immediately confirmed appointment — only the old page title overclaimed, and that's now fixed. `appointment.subtitle` ("Vereinbaren Sie Ihren Besuch..."/"...randevunuzu ayarlayın") was left unchanged — not requested, and "arrange your visit" doesn't itself claim instant confirmation.

**Note:** Turkish copy is a direct mirror of the German fix (both specified directly by the user), not independently native-speaker-reviewed beyond that.

---

### 2. JSON-LD opening-hours split-shift fix (Finding A) — APPLIED

**File:** `src/lib/schema.ts`, `openingHoursSpecification` array (currently lines 60-66)

**Current:**
```
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "19:00" },
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "17:00" },
```

**Proposed:** split each into two entries, matching `src/lib/opening-hours.ts`'s real schedule:
```
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "13:00" },
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "14:00", closes: "19:00" },
...
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "12:00" },
{ "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "13:00", closes: "17:00" },
```

**Rationale:** Pure factual correction — makes structured data match the clinic's own displayed hours. Currently Google is told the clinic is open through the lunch break on both days, on every one of the 58 affected pages.

**Risk if unapproved:** Google continues to show incorrect "open now" status and hours for the practice, potentially sending patients to a closed office during the 13:00–14:00 (Mon) / 12:00–13:00 (Wed) gaps.

**Note:** The long-term fix (deriving this array programmatically from a single schedule source) is deferred to Phase 4, where the CMS becomes that single source of truth. This is the minimal stopgap. Values used are exactly `src/lib/opening-hours.ts`'s own `clinicSchedule` — the clinic's own in-repo approved hours, not any third-party listing.

---

### 3. Metadata bug on the two locale-exclusive landing pages (Finding F) — APPLIED (expanded scope, see note)

**Files:** `src/app/[locale]/turk-kbb-doktoru-wien/page.tsx:10-14`, `src/app/[locale]/cocuk-kbb-wien-1100/page.tsx:9-13`

**Current (example, `turk-kbb-doktoru-wien/page.tsx`):**
```ts
export const metadata: Metadata = {
  title: "Türk KBB Doktoru Wien | Dr. Ümit Alici",
  description: seoLandings.turkishHno.metaDescription.tr,
  keywords: [...seoLandings.turkishHno.keywords],
};
```

**Proposed:** convert to `generateMetadata()` matching the pattern already used correctly in the sibling `tuerkischer-hno-arzt-wien/page.tsx`:
- `title: data.title.tr` (bare string, let the locale layout's template add the site-name suffix exactly once — removes the duplicated "Dr. Ümit Alici").
- Add `alternates.canonical` pointing at this page's own URL (`${siteConfig.domain}/tr/turk-kbb-doktoru-wien`) and `alternates.languages` pointing back at the correct DE sibling (`de -> .../de/tuerkischer-hno-arzt-wien`, `tr -> .../tr/turk-kbb-doktoru-wien`, matching what the DE sibling already declares in reverse) — making hreflang reciprocal.
- Apply the identical fix to `cocuk-kbb-wien-1100/page.tsx` (mirrored against `kinder-hno-wien-1100`).

**Rationale:** Fixes three stacked, confirmed defects (duplicated title, non-reciprocal hreflang, inconsistent/missing canonical) from one root cause, by making these two pages consistent with their already-correct siblings. Low risk — purely metadata, no visible content/copy change.

**Risk if unapproved:** Search engines see a malformed title tag and incomplete/contradictory hreflang signals on 4 page variants, which can cause the wrong locale version to rank or hreflang to be ignored entirely.

**Scope note (discovered during implementation, within the approved "fix hreflang/canonical" scope):** Verifying the actual rendered canonical tags surfaced that the two *already-correct* sibling pages (`tuerkischer-hno-arzt-wien/page.tsx`, `kinder-hno-wien-1100/page.tsx`) had their own, smaller defect: specifying `alternates.languages` without `alternates.canonical` caused them to silently lose any canonical tag at all (Next.js replaces the parent's whole `alternates` object rather than merging it field-by-field). Deeper check also found: both `turk-kbb-doktoru-wien` and `cocuk-kbb-wien-1100` hardcode `lang="tr"` in their rendered `<SeoLandingTemplate>` regardless of the `locale` URL param, and `tuerkischer-hno-arzt-wien`/`kinder-hno-wien-1100` pass `lang={locale}` — meaning each topic genuinely renders **identical Turkish content at two different URLs** (e.g. `/tr/tuerkischer-hno-arzt-wien` and `/tr/turk-kbb-doktoru-wien` show the same Turkish text). This is a real duplicate-content situation, not just a metadata nicety.

**Applied fix (all 4 files):** each route's `generateMetadata()` now sets `canonical` to the URL of whichever locale prefix actually matches the *rendered content's* language (not the URL's own locale segment) — i.e. the 2 URLs that genuinely show German content canonicalize to themselves with reciprocal `alternates.languages`; the 2 URLs that show Turkish content under a German-looking slug/prefix canonicalize to the real Turkish URL instead of to the homepage, and don't declare their own hreflang (letting the canonical resolve it). No JSX/component rendering was changed — this is purely a metadata-level fix, same actual page content as before.

---

### 4. Color-contrast fix for `--color-gold` (Finding G)

**File:** `src/app/globals.css:9` (`--color-gold: #c4a35a`)

**Proposed:** darken the gold token used for text (keep a separate, lighter value for non-text decorative uses like borders/icons if needed) to meet WCAG AA 4.5:1 against the backgrounds it's actually used on. pa11y's own measurements suggest a text color around `#927128` on light/cream backgrounds; the dark-teal review-card background (`#13434b`) is only marginally failing (4.07:1 vs 4.5:1 required) and may need either a slightly lighter gold there or a background adjustment — **exact replacement value(s) need a real contrast-checker pass against every background this token is used on before merging**, not just the two spot values pa11y suggested for the homepage.

**Rationale:** Confirmed, reproducible WCAG 2 AA failures affecting low-vision users across the entire site (this is a shared design token, not a one-page issue) — eyebrow labels, star ratings, and review-platform links are all affected.

**Risk if unapproved:** Site-wide AA accessibility failure persists; pre-existing, not a regression from this work, but now documented with exact values.

---

### 5. Minor accessibility fixes (Findings H, I) — APPLIED

- **H:** `src/lib/site.ts:5`, `phoneDisplay: "+43 1 6025400"` → proposed `"+43 1 6025400"` (non-breaking spaces) so the phone number can't wrap mid-number in narrow layouts.
- **I:** `src/components/reviews/StarRating.tsx:14` — wrap the `aria-label`-bearing `<div>` with `role="img"` (or move the label to a parent element that has an implicit role) so "4 von 5 Sternen" is reliably exposed to screen readers.

**Risk if unapproved:** Minor, pre-existing accessibility rough edges; low impact relative to Finding G.

---

### 6. Orphaned legal JSON files (Finding C)

**Files:** `src/content/impressum.json`, `src/content/datenschutz.json`

**Proposed:** delete, **pending explicit human confirmation** — grep evidence of zero imports is not sufficient proof of safety for legal-document files on its own (could theoretically be read by an external tool/script not present in this repo). Awaiting sign-off before any deletion.

---

### Explicitly NOT touched in Phase 3

- `src/content/reviews.ts` rating numbers and testimonial text (Finding E) — requires the practice owner to verify against live Google/DocFinder/Herold listings. No proposed diff given.
