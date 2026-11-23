# Sanity CMS Full Coverage Implementation — Completion Report

**Datum:** 2026-11-22. **Branch:** `cms/phase2-4-audit-sanity` (unverändert — kein Push, kein Merge, kein Deployment, keine DNS-Änderung). Alle 116+ uncommitteten Dateien aus vorherigen Sitzungsrunden sind erhalten, kein Git-Reset, kein Git-Clean.

## Vorher/Nachher-Vergleich

| | Vorher (Audit-Stand) | Nachher (dieser Durchlauf) |
|---|---|---|
| Vollständig editierbar & verbunden | 19 / 45 (42%) | **43 / 47 (91,5%)** |
| Davon „by design" korrekt geschützt (nicht Teil der Rechnung) | 2 | 2 |
| **CMS-Abdeckung redaktioneller Inhalte** (Technik herausgerechnet) | 19 / 43 = **44%** | **43 / 45 = 95,6%** |
| Echte verbleibende Lücke | 2 | 2 (siehe „Offene Punkte") |

Die Berechnungsgrundlage ist identisch mit dem ursprünglichen Audit (`CMS_GAP_ANALYSIS.md`): gezählt werden ausschließlich die 45 ursprünglich geprüften Elemente (+2 im Zuge dieser Runde explizit als eigene Zeile ausgewiesene „by design"-Elemente, die vorher nur in Prosa erwähnt waren) — keine neuen, erfundenen Prozentpunkte.

## Behobene P0-Probleme (alle 5)

1. **Mega-Menü/Startseite-Leistungstexte** lasen bisher aus `messages/*.json`, unabhängig vom Sanity-gepflegten `service`-Dokument. **Behoben**: `ServicesPreview.tsx`, `ServicesMegaMenu.tsx` (Desktop-Panel) und `Header.tsx` (Mobile-Akkordeon) lesen jetzt alle aus `service.shortTitle`/`service.cardText` — demselben Dokument, das `ServiceLanding.tsx` für die Detailseite nutzt. Ein neues Feld `shortTitle` wurde ergänzt (die H1 der Detailseite enthält bewusst den Ortszusatz „Wien 1100", der im Menü zu lang wirkt — bestätigt durch einen echten Testlauf, bei dem die ursprüngliche 1:1-Ersetzung 4 Playwright-Tests zum Scheitern brachte, weil der Menütitel plötzlich „Allgemeine HNO Wien 1100" statt „Allgemeine HNO" zeigte; korrigiert durch das dedizierte Kurzfeld).
2. **3 Ärzte, nur 1 in Sanity.** Neues `src/content/doctors-list.ts` überlagert die lokale 3-Ärzte-Liste mit echten `doctor`-Dokumenten (gematcht nach Name). Mechanismus vollständig funktionsfähig und für Startseite UND Team-Seite gemeinsam genutzt (vorher zwei unabhängige Kopien derselben Logik). **Wichtig**: Dr. Sigrid Meier und Dr. Benjamin Alici haben noch keine eigenen `doctor`-Dokumente in der echten production-Datenbank — siehe „Offene Punkte".
3. **Bewertungen/Ratings ohne Schema.** Zwei neue Dokumenttypen: `reviewPlatform` (Google/DocFinder/Herold) und `patientReview` (einzelne Patientenstimmen). `src/content/reviews.ts` überlagert jetzt beide, ohne eine einzige Komponente anfassen zu müssen (gleicher Exportname, gleiche Form). Mechanismus funktionsfähig; die echten Dokumente stehen noch aus — siehe „Offene Punkte".
4. **4 sprachexklusive SEO-Landingpages außerhalb Sanity.** Neuer Dokumenttyp `landingPage` (2 Dokumente, je eines pro Sprachpaar — `/tuerkischer-hno-arzt-wien`+`/turk-kbb-doktoru-wien` und `/kinder-hno-wien-1100`+`/cocuk-kbb-wien-1100`). **Die tatsächlichen URLs, Slugs und die Hreflang-Zuordnung bleiben unverändert im Code** — das Feld `slugKey` dient nur der Zuordnung, nicht dem Routing, exakt wie gefordert.
5. **Structured Data hardcodiert.** `schema.ts` liest jetzt `doctorProfile.name`/`.clinicalTitle`/`.medicalSpecialties` statt feste Strings, und die Bildreferenzen (`Physician.image`, `MedicalClinic.image`) nutzen denselben `getEditableImage(...)`-Pfad wie die sichtbare Seite — ein Fotowechsel kann nicht mehr unbemerkt auseinanderlaufen. Die technische Schema.org-Erzeugung selbst (JSON-LD-Struktur, Feldnamen) bleibt zentral im Code, wie verlangt.

## Behobene P1-Probleme (alle 9)

| # | Was | Wie |
|---|---|---|
| 1 | `siteSettings.socialLinks` ungenutzt | `Footer.tsx` iteriert jetzt die echte Liste (vorher 1 hardcodierter Facebook-Link); `kontakt/page.tsx`s Quick-Info-Karte ebenso |
| 2 | `siteSettings.logo` ungenutzt | `Footer.tsx` nutzt `siteConfig.logo` mit Fallback auf den bisherigen Pfad |
| 3 | `siteSettings.seo.defaultOgImage` ungenutzt | `layout.tsx`s Open-Graph/Twitter-Bild nutzt es jetzt |
| 4 | Structured-Data-Bilder nicht verknüpft | Siehe P0 Punkt 5 |
| 5 | 2 getrennte FAQ-Quellen | Bewusst getrennt belassen (allgemeine FAQ ≠ leistungsspezifische FAQ, eine legitime inhaltliche Unterscheidung) — aber die allgemeine FAQ ist jetzt selbst Sanity-editierbar (neues `siteSettings.generalFaq`-Array), geteilt zwischen Startseite und `/patienteninfo` |
| 6 | Hero-Trust-Badges ohne Anbindung | 3 Labels jetzt über `textOverrides[section=heroBadges]` editierbar |
| 7 | Leistungen-Übersicht vs. Mega-Menü/Startseite | **Untersucht und bewusst getrennt belassen** — die Übersichtsseite zeigt echte, reichhaltigere Inhalte (Symptom-/Behandlungslisten je Kategorie), keine Kopie der Kurztexte; eine Zusammenführung hätte das Layout riskiert, ohne einen echten Duplikat-Bug zu beheben |
| 8 | 13 codegebundene Seiten-SEO-Felder | Neues `siteSettings.pageSeo[]`-Array (Seite wählen, Meta-Titel/-Beschreibung optional überschreiben) — in allen 13 betroffenen `generateMetadata()`-Funktionen verdrahtet (Team, Kontakt, Leistungen-Übersicht, Patienteninfo, Bewertungen, Termin, 4 Rechtsseiten, Arztprofil + 3 Unterseiten) |
| 9 | `about.eyebrow` nicht vorbefüllt | Mit dem echten, bereits live stehenden Text nachträglich befüllt |

## Behobene P2-Elemente (Phase 3)

- **Navigation-Beschriftungen**: alle 5 Hauptnavigationspunkte (Ordination/Team/Bewertungen/Kontakt/Dr. Ümit Alici) jetzt über `textOverrides[section=nav]` editierbar — **die Routen/Links selbst bleiben zu 100% im Code**, nur der angezeigte Text ist editierbar (wie ausdrücklich gefordert: „technische URLs und Routing-Regeln geschützt").
- **CTA-Beschriftungen**: der zentrale Hero-Button „Termin buchen" ist jetzt editierbar. Kleinere, sehr selten geänderte Button-Texte (z. B. „Mehr erfahren") wurden bewusst nicht angefasst — siehe „Offene Punkte" für eine ehrliche Einordnung.
- **Footer-Überschriften**: Tagline, Copyright-Zeile und Notfall-Hinweis jetzt editierbar. Die 4 Spaltenüberschriften/Linktexte selbst bleiben kurze strukturelle Chrome-Texte (P2, niedrige Priorität, siehe Roadmap).
- **About-Checkliste**: alle 3 Punkte einzeln editierbar.
- **Patienteninformationen**: die 3 Blöcke „Alle Kassen"/„Akuttermine"/„Downloads" (Titel + Text) sind jetzt editierbar.
- **Service-Unterüberschriften**: „Symptome"/„Behandlungen"/„Weitere Leistungen" auf jeder Leistungs-Detailseite editierbar.

Keine konkurrierenden oder doppelten Datenquellen wurden dabei erzeugt — jede Änderung folgt demselben bereits etablierten Muster: lokaler Fallback mit dem exakten, bereits echten Text, Sanity überschreibt nur, was tatsächlich gesetzt ist.

## Studio-Feldnamen (Auszug, vollständig in Deutsch mit Hilfetexten)

Jedes neue Feld trägt einen klaren deutschen Titel und, wo sinnvoll, eine erklärende Beschreibung — Beispiele: „Kurzname (für Menü & Startseite, ohne Ort)" (`service.shortTitle`), „Fachärztliche Berufsbezeichnung (kurz)" (`doctor.clinicalTitle`), „Seiten-SEO (für Seiten ohne eigenes Schema, z. B. Team, Kontakt)" (`siteSettings.pageSeo`), „Allgemeine FAQ (Startseite & Patienteninfo)" (`siteSettings.generalFaq`). Die Studio-Navigation (`sanity/structure.ts`) wurde um „SEO-Landingpages", „Bewertungsplattformen" und „Patientenbewertungen" ergänzt, an sinnvoller Stelle neben den bestehenden Einträgen.

## Frontend-Verbindungen — real geprüft, nicht nur behauptet

Jede einzelne Änderung wurde nach folgendem Muster verifiziert: `npx tsc --noEmit` → `npm run build` → stichprobenartige Prüfung des tatsächlich gerenderten HTML (z. B. `grep` nach den erwarteten deutschen/türkischen Texten in `out/de/index.html` bzw. `out/tr/index.html`) → vollständiger Playwright-Lauf. Dies geschah nicht einmal am Ende, sondern iterativ nach jedem der 5 P0-Fixes und noch einmal final.

## Build-Ergebnisse

- `npx tsc --noEmit`: sauber (mehrfach während der gesamten Umsetzung geprüft).
- `npm run build`: sauber, alle Routen erfolgreich generiert.

## Playwright-Tests

**154/154 bestanden** im finalen Lauf. Ein Zwischenlauf nach dem ersten Mega-Menü-Fix zeigte **4 reale, aussagekräftige Fehlschläge** (Mega-Menü zeigte plötzlich „Allgemeine HNO Wien 1100" statt „Allgemeine HNO") — das war kein Test-Defekt, sondern deckte den oben beschriebenen `shortTitle`-vs-`h1`-Fehler auf, der daraufhin korrigiert wurde. Keine Tests wurden angepasst, um einen Fehler zu verstecken.

## Bildwechseltests

- Hero-/Team-/Leistungen-Bilder: Mechanismus unverändert funktionsfähig, Dr. Benjamin Alici zeigt weiterhin korrekt einen Initialen-Avatar statt eines erfundenen Fotos (per Playwright-Test bestätigt, unverändert bestehend).
- **Focal Points (Hotspot)**: Dem Sanity-Schema der 5 zentralen „Editierbaren Bilder" wurde `options.hotspot: true` hinzugefügt — ein Redakteur kann jetzt im Studio einen Bildausschnitt-Fokuspunkt setzen. **Ehrlich zu vermerken**: das Frontend liest diesen Fokuspunkt aktuell noch nicht aus (Bilder werden weiterhin per CSS `object-cover` zentriert zugeschnitten, ohne die Hotspot-Koordinaten zu berücksichtigen). Das vollständige Verdrahten (Hotspot-Koordinaten durch `urlFor()` bis zum `object-position`-Stil jeder einzelnen Bildkomponente) ist eine eigene, nicht-triviale Aufgabe, die in der verbleibenden Zeit nicht ohne Risiko einer fehlerhaften Bildausschnittswahl umsetzbar war — bewusst nicht als „erledigt" gemeldet.

## SEO-Validierung

- Alle 13 vormals codegebundenen Seiten-Metadaten funktionieren weiterhin korrekt (lokaler Fallback = der bisherige, bereits korrekte Text) — per Playwright (`seo.spec.ts`, inkl. des „15 Seiten hatten denselben Titel"-Regressionstests) bestätigt.
- Hreflang/Canonical für die 4 SEO-Landingpages unverändert korrekt (Routing wurde nicht angefasst).
- Structured Data (`Physician`, `MedicalClinic`) weiterhin mit den echten, unveränderten Werten — jetzt aus Sanity-Feldern statt Literalen, Inhalt identisch (per `grep` auf das gebaute HTML verifiziert).

## Offene Punkte (ehrlich benannt, wie ausdrücklich verlangt)

1. **Inhaltliche Befüllung dreier neuer Dokumenttypen in production steht noch aus**: 2 weitere Ärzte (`doctor`), 3 Bewertungsplattformen + Patientenbewertungen (`reviewPlatform`/`patientReview`), 2 Landingpage-Dokumente (`landingPage`). Der Mechanismus ist vollständig fertig und lokal verifiziert (Build, Typecheck, gerendertes HTML) — es fehlen nur die echten Sanity-Dokumente selbst. **Grund**: Das Anlegen dieser Dokumente in der echten production-Datenbank erfordert ein neues, befristetes Sanity-Token; der Erstellungsversuch wurde von der automatischen Sicherheitsprüfung meines eigenen Werkzeugs als sensible Aktion blockiert (dieselbe Klasse von Blockade wie zuvor bei der CORS-Änderung) — bewusst nicht erzwungen. Du kannst entweder selbst ein Editor-Token unter sanity.io/manage erstellen und mir mitteilen, dass ich fortfahren soll, oder die Dokumente selbst im Studio anlegen (Felder und Hilfetexte stehen bereit).
2. **Bild-Fokuspunkte (Hotspot)**: Schema fertig, Frontend-Anbindung noch offen (siehe oben) — P1.
3. **Leistungen-Übersichtsseite** (`/leistungen`): bewusst nicht mit den Kurztexten vereinheitlicht, da inhaltlich echt unterschiedlich (reichhaltigere Listen) — P2, Entscheidung dokumentiert in `CMS_GAP_ANALYSIS.md`/`CMS_IMPLEMENTATION_ROADMAP.md`.
4. **Footer-Spaltenüberschriften, einzelne kleinere Button-Texte** (z. B. „Mehr erfahren"): bewusst nicht angefasst — sehr kurze, selten geänderte UI-Textbausteine, niedrigste Priorität.
5. **Kein Live-Preview**: unverändert architekturell bedingt (kein Server unter GitHub Pages) — betrifft alle Felder gleichermaßen, nicht neu.
6. **Publish-Automatisierung**: weiterhin nicht aktiviert (wie in jeder vorherigen Runde, unverändert, nicht Teil dieses Auftrags).

## Release-Empfehlung

**Code-seitig bereit, Content-seitig noch nicht vollständig** — eine klare Unterscheidung:

- Die **technische Umsetzung** (Schema, Query-Schicht, Content-Loader, Komponenten-Verdrahtung) ist vollständig, getestet und regressionsfrei. Kein Nutzer der Live-Website sieht aktuell einen Unterschied (lokaler Modus bleibt exakt wie vorher) — das ist beabsichtigt und mehrfach verifiziert.
- Für **100% tatsächlich nutzbare CMS-Verwaltung** fehlen noch: die 3 neuen Dokumenttypen mit echten Inhalten befüllen (Punkt 1 oben) und die Hotspot-Frontend-Anbindung (Punkt 2). Beides ist klar umrissen, nicht blockierend für den aktuellen Stand, aber nötig für das „100%"-Ziel im wörtlichen Sinne.
- **Keine Freigabe für `CONTENT_SOURCE=sanity` in Production** wurde erteilt oder vorgenommen — das bleibt, wie in jeder vorherigen Runde, eine gesonderte, noch ausstehende Entscheidung.
