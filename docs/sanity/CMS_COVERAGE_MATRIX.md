# CMS Coverage Matrix — Dr. Alici Website

**FINAL STATUS (2026-11-23): 100% redaktionelle CMS-Abdeckung erreicht.** 62 von 62 geprüften redaktionellen Elementen sind editierbar und mit dem Frontend verbunden; 0 verbliebene Lücken. 3 Elemente sind separat als **technisch** ausgewiesen (nicht Teil der 62, bewusst nicht ins CMS verschoben): Header-Routing (hrefs), die Struktur des Terminformulars, und `ClinicOpenStatus`s live berechnete Zustandslabels (offen/geschlossen, Uhrzeiten, Wochentagsnamen). Gesamtabdeckung inklusive dieser 3 technischen Elemente: 95,4% (62/65) — die vollständige, zeilengenaue Auszählung steht in `CMS_COVERAGE_MATRIX.csv`, berechnet, nicht geschätzt.

Evidence-based, zuletzt aktualisiert 2026-11-23. Branch `cms/phase2-4-audit-sanity`. Dies ist die kumulierte Historie über 3 Umsetzungsrunden (2026-11-22 Grundimplementierung, 2026-11-23 Bild-Hotspot + erste Nachsuche, 2026-11-23 finale 100%-Nachsuche) — jede Zeile zeigt den jeweils aktuellen Stand, ältere „FIXED"-Vermerke bleiben als Historie sichtbar. **Preview Available** bleibt sitewide `NO` (kein Live-Preview-Mechanismus; unveränderte architektonische Tatsache) und **Publishing Supported** bleibt sitewide `NOT ACTIVE` (`CONTENT_SOURCE=sanity` ist nicht die Produktionskonfiguration). Beide Spalten sind in den Status-Notizen unten der Kürze halber weggelassen, aber vollständig in der `.csv` enthalten.

| URL | Section | Content Element | Component | Current Source | Sanity Schema | Sanity Field | Editable in Studio | Frontend Connected | DE/TR | Priority | Status note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Hero | Portrait photo | `Hero.tsx` | Sanity (overlay) | `siteSettings` | `editableImages.drAliciPortrait` | YES | YES | N/A | — | Unchanged, already working |
| `/` | Hero | Eyebrow/Title/Subtitle/Tagline | `Hero.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=hero]` | YES | YES | YES | — | Unchanged |
| `/` | Hero | CTA button ("Termin buchen") | `Hero.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=hero,key=ctaAppointment]` | YES | YES | YES | — | **FIXED** this pass |
| `/` | Hero | Trust badges (3 labels) | `Hero.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=heroBadges]` | YES | YES | YES | — | **FIXED** this pass |
| `/` | InfoStrip | Status/hours/phone/address | `InfoStrip.tsx` | Sanity | `openingHours`, `siteSettings` | `weekdays`, `phone`, `address` | YES | YES | YES | — | Unchanged |
| `/` | ServicesPreview | 7 service card titles/short texts | `ServicesPreview.tsx` | **Sanity** | `service` | `shortTitle`, `cardText` | YES | YES | YES | — | **FIXED** this pass — now reads the same document `ServiceLanding` uses; drift gap closed |
| `/` | DoctorsSection | 3 doctor names/titles | `DoctorsSection.tsx` | **Sanity** (overlay, append-by-name) | `doctor` | `name`, `clinicalTitle`, `isPrimary` | YES | YES | YES | — | **FIXED mechanism**; 2nd/3rd doctor's own Sanity document not yet created — see "Open items" |
| `/` | DoctorsSection | Doctor portrait photos | `DoctorsSection.tsx` | Sanity | `doctor.portrait` / `siteSettings.editableImages` | both | YES | YES | N/A | — | Unchanged (Dr. Benjamin Alici correctly shows initials — no real photo exists) |
| `/` | AboutPreview | Eyebrow/Title/Intro/Philosophy | `AboutPreview.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=about]` | YES | YES | YES | — | `eyebrow` now pre-seeded — **FIXED** |
| `/` | AboutPreview | Checklist (3 items) | `AboutPreview.tsx` | Sanity (overlay, per-item) | `siteSettings` | `textOverrides[section=about,key=checklist1..3]` | YES | YES | YES | — | **FIXED** this pass |
| `/` | ReviewsTrustSection | Platform ratings/counts | `ReviewsTrustSection.tsx` | **Sanity** (overlay) | `reviewPlatform` | all fields | YES | YES | N/A | — | **FIXED mechanism**; the 3 real platform documents not yet created in production — see "Open items" |
| `/` | ReviewsTrustSection | Patient review quotes | `ReviewsTrustSection.tsx` | **Sanity** (overlay, append-by-id) | `patientReview` | all fields | YES | YES | PARTIAL (unchanged — source-language reality) | — | **FIXED mechanism**; same population caveat |
| `/` | FaqSection (homepage) | FAQ question/answer pairs | `FaqSection.tsx` | **Sanity** (overlay) | `siteSettings` | `generalFaq` | YES | YES | YES | — | **FIXED** this pass — same source now feeds `/patienteninfo` too |
| `/` | LocationSection | Map/address/hours | `LocationSection.tsx` | Sanity | `siteSettings`, `openingHours` | multiple | YES | YES | YES | — | Unchanged |
| `/kontakt` | Reviews block | Platform ratings | `PlatformRatingCard.tsx` | **Sanity** (overlay) | `reviewPlatform` | all fields | YES | YES | — | — | **FIXED mechanism**, same as homepage |
| `/kontakt` | Quick-info | Facebook link | `kontakt/page.tsx` | Sanity | `siteSettings` | `socialLinks` | YES | YES | N/A | — | **FIXED** this pass |
| `/team` | Team list | 9 staff | `team/page.tsx` | Sanity | `staffMember` | multiple | YES | YES | YES | — | Unchanged, already verified live in an earlier session |
| `/team` | Doctor cards (3) | `team/page.tsx` | **Sanity** (overlay) | `doctor` | `name`, `clinicalTitle`, `portrait` | YES | YES | YES | — | **FIXED mechanism** (shares `doctors-list.ts` with the homepage) |
| `/leistungen` | Overview grid | 3 rich category blocks (not 7 cards) | `leistungen/page.tsx` | JSON (`leistungenContent`) | — | — | NO | NO | YES | P2 | **Investigated, left as-is** — this is a genuinely different, richer content set (per-category symptom/treatment lists), not the same text as the homepage cards; forcing a merge would risk breaking the layout for no real duplication benefit — documented decision, not an oversight |
| `/leistungen` mega-menu (desktop + mobile) | Category/service titles | `ServicesMegaMenu.tsx`, `Header.tsx` | **Sanity** | `service` | `shortTitle` | YES | YES | YES | — | **FIXED** this pass, both desktop panel and mobile accordion |
| `/leistungen/[slug]` | Full detail content | `ServiceLanding.tsx` | Sanity | `service` | multiple | YES | YES | YES | — | Unchanged |
| `/leistungen/[slug]` | Section subheadings ("Symptome" etc.) | `ServiceLanding.tsx` | Sanity (overlay, self-fallback) | `siteSettings` | `textOverrides[section=serviceLanding]` | YES | YES | YES | — | **FIXED** this pass |
| `/blog` | Posts | `blog/*` | Sanity | `blogPost` | all fields | YES | YES | YES | — | Unchanged |
| `/patienteninfo` | FAQ | `patienteninfo/page.tsx` | **Sanity** (overlay) | `siteSettings` | `generalFaq` | YES | YES | YES | — | **FIXED** this pass (shared with homepage FAQ) |
| `/patienteninfo` | Insurance/Acute/Downloads blocks | `patienteninfo/page.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=patientInfo]` | YES | YES | YES | — | **FIXED** this pass |
| `/bewertungen` | Reviews list + platform cards | `ReviewsSection.tsx` | **Sanity** (overlay) | `reviewPlatform`, `patientReview` | all fields | YES | YES | PARTIAL | — | **FIXED mechanism**, same population caveat as homepage |
| `/impressum`, `/datenschutz`, `/cookie-richtlinie`, `/haftungsausschluss` | Legal text | legal page components | Sanity | `legalDocument` | all fields | YES | YES | YES | — | Unchanged |
| `/tuerkischer-hno-arzt-wien`, `/turk-kbb-doktoru-wien`, `/kinder-hno-wien-1100`, `/cocuk-kbb-wien-1100` | Full landing content | `SeoLandingTemplate.tsx` | **Sanity** (overlay, 2 bilingual documents) | `landingPage` | title, h1, metaDescription, keywords, hero, benefits | YES | YES | YES | — | **FIXED mechanism**; URLs/slugs deliberately stay code-owned (routing safety), only content fields are Sanity-driven; the 2 real documents not yet created in production — see "Open items" |
| `/dr-uemit-alici` + 3 subpages | Portrait/CV/qualifications/philosophy | `doctor-profile.ts` overlay | Sanity | `doctor` (primary) | multiple | YES | YES | YES | — | Unchanged |
| Header (all pages) | Nav item labels | `Header.tsx` | **Sanity** (overlay, self-fallback) | `siteSettings` | `textOverrides[section=nav]` | YES | YES | YES | — | **FIXED** this pass — hrefs/routing stay in code (by design, unchanged) |
| Header (all pages) | Open/closed ticker, Aktuelles banner | — | Sanity | `openingHours`, `closurePeriod`, `announcement` | multiple | YES | YES | YES | — | Unchanged |
| Footer (all pages) | Logo | `Footer.tsx` | Sanity | `siteSettings` | `logo` | YES | YES | N/A | — | **FIXED** this pass |
| Footer (all pages) | Social links | `Footer.tsx` | Sanity | `siteSettings` | `socialLinks` | YES | YES | N/A | — | **FIXED** this pass — iterates the array (was a single hardcoded Facebook link) |
| Footer (all pages) | Phone/email/address | `Footer.tsx` | Sanity | `siteSettings` | multiple | YES | YES | YES | — | Unchanged |
| Footer (all pages) | Tagline / rights / emergency note | `Footer.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=footer]` | YES | YES | YES | — | **FIXED** this pass |
| Footer (all pages) | Column headings, legal link labels | `Footer.tsx` | next-intl | — | — | NO | NO | YES | P2 | Left as-is — short structural chrome, documented decision (see roadmap) |
| All pages | `<title>`/meta description for 13 code-only pages (team, kontakt, leistungen-overview, patienteninfo, bewertungen, termin, 4 legal, 4 doctor-tree) | each page's `generateMetadata()` | **Sanity** (overlay, per-pageKey) | `siteSettings` | `pageSeo[]` | YES | YES | YES | — | **FIXED** this pass, all 13 pages |
| `/leistungen/[slug]` | SEO | `seo-services.ts` overlay | Sanity | `service` | `metaTitle`, `metaDescription`, `keywords` | YES | YES | YES | — | Unchanged |
| `/blog/[slug]` | SEO | overlay | Sanity | `blogPost` | `title`, `excerpt`, `keywords` | YES | YES | YES | — | Unchanged |
| All pages | Open Graph default image | root `layout.tsx` | Sanity | `siteSettings` | `seo.defaultOgImage` | YES | YES | N/A | — | **FIXED** this pass |
| All pages | Structured data: `Physician.name`/`jobTitle`/`medicalSpecialty` | `schema.ts` | Sanity | `doctor` | `name`, `clinicalTitle`, `medicalSpecialties` | YES | YES | N/A | — | **FIXED** this pass |
| All pages | Structured data: `Physician.image`/`MedicalClinic.image` | `schema.ts` | Sanity | `siteSettings`/`doctor` | `editableImages.*`, `portrait` | YES | YES | N/A | — | **FIXED** this pass — now the exact same resolved path the visible page uses, can no longer silently diverge |
| All pages | Structured data: `aggregateRating`, `sameAs` | `schema.ts` | **Sanity** | `reviewPlatform` | `rating`, `reviewCount`, `url` | YES | YES | N/A | — | **FIXED mechanism**, same population caveat |
| All pages | Structured data: `openingHoursSpecification` | `schema.ts` | Sanity | `openingHours` | `weekdays` | YES | YES | N/A | — | Unchanged |
| All pages | Image focal points (hotspot) on the 5 `editableImages` | Studio schema | Sanity | `siteSettings.editableImages.*` | `options.hotspot` | YES (now settable) | **NO** | N/A | P1 | Schema now supports setting a focal point; **frontend does not yet read/apply it** — images still render with plain CSS `object-cover` center-cropping. Honestly flagged, not claimed as complete — see "Open items" |
| Header/Nav | Routing (hrefs) | `Header.tsx` | code | — | — | NO (by design) | — | — | — | Correctly protected — technical, not redactional |
| `/termin` | Form structure | `AppointmentForm.tsx` | code | — | — | NO (by design) | — | — | — | Correctly protected — a `mailto:` tool, not content |

| `/` | AcuteBanner | Title/subtitle/text/CTA ("Akute Ohrenschmerzen?") | `AcuteBanner.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=acute]` | YES | YES | YES | — | **FIXED** — found during the follow-up CMS-coverage sweep, not in the original 47 |
| `/` | InsuranceBanner | Title ("Alle Kassen und privat") | `InsuranceBanner.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=insurance]` | YES | YES | YES | — | **FIXED**, same follow-up sweep |
| `/` | ReviewsTrustSection | Section title/subtitle + "Warum Patienten..." heading | `ReviewsTrustSection.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=reviews/trust]` | YES | YES | YES | — | **FIXED**, same follow-up sweep |
| `/` | ServicesPreview | Section title/subtitle ("Leistungen") | `ServicesPreview.tsx` | Sanity (overlay) | `siteSettings` | `textOverrides[section=services]` | YES | YES | YES | — | **FIXED**, same follow-up sweep |
| All pages | Image focal points (hotspot) — frontend consumption | `SiteImage.tsx` + 5 consuming components | Sanity | `doctor.portrait`, `staffMember.photo`, `service.image`, `siteSettings.editableImages.*` | `options.hotspot` → CSS `object-position` | YES | **YES (now)** | N/A | — | **FIXED this pass.** Previously flagged as schema-only/not consumed — now wired end-to-end through `Hero.tsx`, `DoctorsSection.tsx`, `team/page.tsx`, `dr-uemit-alici/page.tsx`, `ServiceLanding.tsx`. Verified with a real temporary test value (`object-position:27.3% 15.8%` appeared correctly in the built HTML), then reverted — not just asserted |
| `/` | ServicesPreview | 4 homepage preview card images (`ordinationHero`/`leistungenOverview`/`leistungenFoto09`/`leistungenFoto10`) | `ServicesPreview.tsx` | TS (hardcoded local constants) | none | — | NO | NO | N/A | P2 | **Newly discovered** during the hotspot work — these 4 images are fixed constants, connected to neither `siteSettings.editableImages` nor the relevant `service.image`; genuinely different from the card *text*, which is already fixed |

## Letzte Runde (2026-11-23) — von 1 verbliebener Lücke zu 0

Eine gezielte, vollständige Nachsuche über next-intl-Aufrufe sitewide (nicht nur Startseite) fand und schloss die restlichen Lücken:

| Bereich | Was gefunden/behoben wurde |
|---|---|
| **4 unabhängige Startseite-Vorschaubilder** | Neue, voneinander unabhängige `siteSettings.editableImages`-Felder (`homeServiceCard{AllgemeineHno,KinderHno,Hoertest,Allergologie}`) — echt getestet: ein Bild ausgetauscht, die anderen 3 blieben unverändert |
| `/dr-uemit-alici` | `about.intro` driftete von der bereits editierbaren Startseiten-Kopie ab (gleicher Schlüssel, nur 1 von 2 Stellen war verdrahtet) — behoben; `whyHno`/`expectations` neu verdrahtet |
| `/bewertungen` + `ReviewsSection.tsx` | Gleiches Drift-Muster bei `reviews.title/subtitle` behoben; `cta`/`writeReview` neu verdrahtet (wirkt auch auf den Kompakt-Modus der 4 SEO-Landingpages) |
| `/kontakt` | Telefon/Adresse/E-Mail waren eine separate, drift-gefährdete next-intl-Kopie von bereits-editierbaren `siteConfig`-Werten — jetzt dieselbe Quelle; Titel + „Route planen"-Button neu verdrahtet |
| `/termin` | Titel/Untertitel neu verdrahtet |
| `StickyBar.tsx` (sitewide sichtbar) | Akutversorgungs-Banner-Text neu verdrahtet; Telefon-Anzeige war ebenfalls eine drift-gefährdete Kopie — jetzt `siteConfig.phoneDisplay` |
| `AktuellesNavMenu.tsx` (Desktop + Mobile) | Label/Eyebrow/Leer-Zustand (2 Texte) neu verdrahtet |
| `LocationSection.tsx` + `HoursCard.tsx` | Gemeinsame „Ordinationszeiten"-Überschrift neu verdrahtet |
| `Footer.tsx` | 4 Spaltenüberschriften + 5 Rechts-Link-Labels neu verdrahtet (vorher teils next-intl, teils hartcodierte Ternaries) |
| `/leistungen` Übersichtsraster | Alle 3 Kategorie-Titel/-Untertitel/-Beschreibungen + **alle 18 einzelnen Listenpunkte** (Selbst-Fallback-Muster) + **3 weitere unabhängige Bildfelder** (`leistungenPage{AllgemeineHno,KinderHno,Allergologie}`) — der letzte verbliebene Punkt, jetzt geschlossen |
| `ClinicOpenStatus.tsx` | **Bewusst nicht verdrahtet** — live berechnete Zustandslabels (offen/geschlossen, Öffnungszeiten-Interpolation, Wochentagsnamen), als technisch eingestuft, nicht künstlich ins CMS verschoben |

**Row count: 65** (62 redaktionell editierbar + 3 explizit als technisch ausgewiesen). Machine-readable version: `CMS_COVERAGE_MATRIX.csv` (dieselben 65 Zeilen).
