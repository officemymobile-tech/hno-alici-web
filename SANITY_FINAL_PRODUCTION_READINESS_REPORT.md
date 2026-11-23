# Sanity CMS — Finaler Abschlussbericht (Runde 2)

**Datum:** 2026-11-23. **Branch:** `cms/phase2-4-audit-sanity` (unverändert — kein Push, kein Merge, kein Deployment, keine DNS-Änderung). Dies baut direkt auf `SANITY_100_PERCENT_COVERAGE_REPORT.md` (Runde 1, 2026-11-22) auf und schließt die dort offen gelassenen Punkte ab bzw. dokumentiert präzise, was weiterhin aussteht.

## 1. Tatsächlicher CMS-Abdeckungsgrad

| | Runde 1 (Vortag) | Runde 2 (heute) |
|---|---|---|
| Vollständig editierbar & verbunden | 43 / 47 | **48 / 53** |
| Davon „by design" korrekt geschützt | 2 | 2 |
| **CMS-Abdeckung redaktioneller Inhalte** | 95,6% | **94,1%** |
| Gesamtabdeckung (inkl. technischer Elemente) | 91,5% | **90,6%** |

Die Prozentzahl ist in dieser Runde leicht gesunken (91,5% → 90,6%), **nicht weil etwas kaputtgegangen ist**, sondern weil die Nenner-Grundgesamtheit gewachsen ist: Bei der gezielten Suche nach „noch nicht editierbaren redaktionellen Elementen" (Auftrag Punkt 3) wurden **6 zusätzliche, bisher nicht erfasste Elemente** gefunden — 5 davon wurden sofort behoben, 1 ist ein echter, neu entdeckter Rest-Gap (siehe unten). Jede einzelne Zahl ist aus der aktuellen `CMS_COVERAGE_MATRIX.csv` direkt auszählbar, keine geschätzten Werte.

## 2. Was in dieser Runde behoben wurde

### Image Hotspot/Focal Point — vollständig verdrahtet und real getestet

Das Sanity-Schema unterstützte Fokuspunkte bereits (Runde 1), aber das Frontend ignorierte sie. Jetzt:

- Neuer Helfer `hotspotPosition()` in `src/lib/sanity/image.ts` liest die Hotspot-Koordinaten aus jedem Sanity-Bildobjekt aus.
- `SiteImage.tsx` hat ein neues `objectPosition`-Prop, das als CSS `object-position` inline gesetzt wird — verändert nichts, wenn kein Hotspot gesetzt ist.
- Durchgezogen für **alle 4 vom Auftrag genannten Bereiche**: Hero (`Hero.tsx`), Arztprofile (`doctor-profile.ts`, `doctors-list.ts`, `dr-uemit-alici/page.tsx`), Mitarbeiterbilder (`team/page.tsx`), Leistungskarten (`ServiceLanding.tsx`).
- **Echt getestet, nicht nur behauptet**: Ein temporärer Testwert (`"27.3% 15.8%"`) wurde kurzzeitig in `Hero.tsx` fest codiert, die Website neu gebaut, und `object-position:27.3% 15.8%` erschien zweimal (Mobil- und Desktop-Bild) im tatsächlichen HTML-Output — danach sofort rückgängig gemacht. Responsive Images (`fill`/`sizes`), Alt-Texte und die LCP-Optimierung (`fetchPriority="high"`) blieben dabei unverändert erhalten.
- Lokaler Modus (kein Hotspot gesetzt): `grep -c object-position out/de/index.html` → **0** — bestätigt, dass sich am bestehenden Design nichts verändert hat, solange niemand im Studio einen Fokuspunkt setzt.

### 4 zusätzliche redaktionelle Elemente gefunden und behoben

Bei der gezielten Suche nach verbliebenen next-intl-only-Texten auf der Startseite:

- `AcuteBanner.tsx` (Titel/Untertitel/Text/Button „Jetzt anrufen" — ein ganzer Abschnitt „Akute Ohrenschmerzen?")
- `InsuranceBanner.tsx` (Titel „Alle Kassen und privat")
- `ReviewsTrustSection.tsx` (Abschnittstitel/-untertitel + „Warum Patienten Dr. Alici wählen")
- `ServicesPreview.tsx` (Abschnittstitel/-untertitel „Leistungen")

Alle vier jetzt über `textOverrides` editierbar, mit dem exakten, bereits echten Text vorbefüllt (identisches Muster wie in Runde 1). Ein totes, nirgendwo verwendetes Legacy-Bauteil (`TrustGrid.tsx`) wurde dabei identifiziert und bewusst **nicht** angefasst (unnötige Arbeit an ungenutztem Code vermieden).

### 1 neuer, echter Rest-Gap gefunden (ehrlich dokumentiert)

`ServicesPreview.tsx`s 4 Startseite-Vorschaukarten-Bilder (`images.ordinationHero`, `images.leistungenOverview`, `images.leistungenFoto09`, `images.leistungenFoto10`) sind feste lokale Konstanten — weder mit `siteSettings.editableImages` noch mit dem jeweiligen `service.image` verbunden. Das ist etwas anderes als der bereits in Runde 1 behobene Kartentext — hier geht es um die Bilder selbst. **Technische Elemente wurden dabei nicht künstlich ins CMS verschoben** (wie ausdrücklich gefordert) — dies ist ein echter, redaktioneller Gap, keine technische Notwendigkeit, nur noch nicht umgesetzt (P2, niedrige Priorität, da die Startseite ohnehin schon mit den echten, bewusst ausgewählten Fotos arbeitet).

## 3. Sanity Content Migration — Plan erstellt, NICHT ausgeführt

Vollständiger, idempotenter Migrationsplan unter `docs/sanity/migration/`:

- `MIGRATION_PLAN.md` — die ausführliche Beschreibung, inkl. Bestandsprüfung (nur `doctor.dr-uemit-alici` existiert aktuell von den 4 relevanten Typen — per echter, lesender Abfrage bestätigt).
- `01-doctors.json`, `02-review-platforms.json`, `03-patient-reviews.json`, `04-landing-pages.json` — die exakten Inhalte, jedes Feld 1:1 aus bereits bestehendem, bereits live stehendem Text kopiert (aus `site-content.ts`, `reviews.ts`, `seo-landings.ts`). **Keine erfundenen Namen, Bewertungen oder Qualifikationen.**
- `run-migration.sh` — nutzt `--missing` (erstellt nur, was noch nicht existiert; verändert nie ein bestehendes Dokument) mit festen, deterministischen IDs im selben Schema wie die bereits migrierten Dokumente.

**Nicht ausgeführt** — wartet auf deine ausdrückliche Freigabe (siehe Abschnitt 4).

## 4. Noch erforderliche Berechtigungen

1. **Freigabe für die Content-Migration** (Abschnitt 3) — ein einziger Befehl (`./run-migration.sh production`), danach prüfe ich das tatsächliche Ergebnis und berichte es dir.
2. **Optional: Foto-Asset für Dr. Sigrid Meier als eigenständiges Sanity-Bild hochladen** — nicht zwingend nötig (der bestehende Fallback-Mechanismus zeigt ihr Foto bereits korrekt an), aber falls ihr Foto künftig über ihr eigenes `doctor`-Dokument mit eigenem Hotspot verwaltet werden soll, wäre ein zusätzlicher Upload-Schritt nötig.
3. Keine weiteren Berechtigungen für die in dieser Runde abgeschlossenen Punkte (Hotspot-Verdrahtung, die 4 neuen Textfelder) — alles bereits umgesetzt, lokal getestet, keine Produktionsschreibung nötig.

## 5. Getestete Funktionen (echte Ergebnisse, kein „sollte funktionieren")

| Test | Ergebnis |
|---|---|
| `npx tsc --noEmit` | sauber |
| `npm run build` | sauber, alle Routen generiert |
| **Playwright, voller Lauf** | **154/154 bestanden** |
| DE-Startseite: neue Texte (Akutversorgung, Kassen, Trust, Leistungen) | per `grep` im gebauten HTML bestätigt vorhanden |
| TR-Startseite: dieselben Texte auf Türkisch | per `grep` im gebauten HTML bestätigt vorhanden (`Ani kulak ağrısı mı?`, `Tüm sigortalar ve özel`, `Hastalar neden...`) |
| Structured Data (`Physician.jobTitle`, `medicalSpecialty`) | unverändert korrekt, jetzt aus `doctorProfile` statt Literalen — per `grep` im gebauten HTML bestätigt |
| Bild-Hotspot-Mechanismus | **real verifiziert** mit einem temporären Testwert (siehe Abschnitt 2), nicht nur angenommen |
| Lokaler Modus zeigt keine `object-position`-Stile | bestätigt (0 Treffer) — kein unbeabsichtigter Design-Unterschied |

## 6. Production-Readiness

**Code-seitig: bereit.** Alle Änderungen dieser Runde sind getestet, regressionsfrei, und verändern das aktuelle Erscheinungsbild der Live-Website nicht (lokaler Modus bleibt exakt wie vorher — `CONTENT_SOURCE=sanity` ist weiterhin nicht aktiv).

**Content-seitig: noch nicht vollständig**, aus genau 2 Gründen, beide klar benannt:

1. Die 3 neuen Dokumenttypen (weitere Ärzte, Bewertungen, Landingpages) haben noch keine echten Inhalte in `production` — der fertige, idempotente Migrationsplan wartet auf deine Freigabe (Abschnitt 3/4).
2. Die 4 Startseite-Vorschaukarten-Bilder sind weiterhin nicht editierbar (Abschnitt 2, P2, niedrige Priorität).

**Keine Freigabe für `CONTENT_SOURCE=sanity` in Production wurde erteilt oder vorgenommen.** Keine Pushes, Merges oder Deployments in dieser Runde.
