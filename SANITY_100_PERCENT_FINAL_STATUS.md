# Sanity CMS — 100% Redaktionelle Abdeckung erreicht (Finaler Status)

**Datum:** 2026-11-23. **Branch:** `cms/phase2-4-audit-sanity` (unverändert). Keine Pushes, Merges, Production-Schreiboperationen oder Deployments in dieser oder einer der vorherigen 3 Runden.

## 1. Tatsächlicher Endstatus: 100% erreicht

| | |
|---|---|
| Redaktionell editierbar & verbunden | **62 / 62 (100%)** |
| Separat ausgewiesene technische Elemente (nicht Teil der 62) | 3 |
| Gesamtabdeckung inkl. technischer Elemente | 95,4% (62/65) |
| Verbliebene echte Lücke | **0** |

Vollständige, zeilengenaue Tabelle: `docs/sanity/CMS_COVERAGE_MATRIX.md`/`.csv`. Jede Zahl ist aus der Datei auszählbar — keine geschätzten Prozentwerte.

### Die 3 technischen Elemente (bewusst nicht ins CMS verschoben)

1. **Header-Navigation — die Routen selbst** (hrefs). Die *Beschriftungen* sind seit Runde 1 editierbar; nur die Ziel-URLs bleiben im Code — aus Routing-Sicherheitsgründen, exakt wie von dir ursprünglich gefordert.
2. **Terminformular-Struktur** (`AppointmentForm.tsx`). Ein reines `mailto:`-Werkzeug ohne serverseitigen Inhalt — es gibt nichts Redaktionelles zu verwalten.
3. **`ClinicOpenStatus.tsx`s berechnete Zustandslabels** (offen/geschlossen, "Öffnet heute um {time}", Wochentagsnamen). Diese Texte werden zur Laufzeit mit echten, live berechneten Werten (aktuelle Öffnungszeiten, Uhrzeiten) interpoliert — näher an einer Systemmeldung als an redaktioneller Prosa. Nicht künstlich ins CMS verschoben, wie von dir ausdrücklich verlangt.

### Was in dieser letzten Runde geschlossen wurde (Details in `CMS_COVERAGE_MATRIX.md`)

- 4 unabhängige Startseite-Vorschaubilder (Task 1 dieser Anfrage).
- 3 weitere unabhängige Bildfelder für die Leistungen-Übersichtsseite (beim finalen Durchgang zusätzlich gefunden und geschlossen).
- 4 echte Content-Drift-Bugs behoben: `about.intro`, `reviews.title/subtitle`, Kontakt-Telefon/-Adresse/-E-Mail, Sticky-Bar-Telefonanzeige — jeweils dieselbe Information, die an einer Stelle schon editierbar war, aber an einer zweiten Stelle eine eigene, nicht synchronisierte next-intl-Kopie hatte.
- Rund 15 weitere, bis dahin unverdrahtete redaktionelle Texte (Terminseite, Aktuelles-Menü, Öffnungszeiten-Überschrift, komplette Fußzeile, komplette Leistungen-Übersicht inkl. aller 18 Listenpunkte einzeln).

## 2. Production-Migration — vollständig geprüft, weiterhin NICHT ausgeführt

Siehe `docs/sanity/migration/DRY_RUN_REPORT.md` für den vollständigen, lesbaren Dry-Run (keine Schreiboperation):

- **13 Dokumente** würden erstellt (0 verändert) — vollständige ID-Liste, vollständige Feldinhalte, exakte Kollisionsprüfung (`[]`, keine Kollision), echte Schema-Validierung (**13/13 gültig, 0 Fehler** — mit `sanity documents validate --file`, einem rein lesenden Befehl).
- **Verhalten bei erneutem Ausführen**: idempotent, dokumentiertes `--missing`-Verhalten — ein zweiter Lauf verändert nichts.
- **Verhalten bei Fehlern**: innerhalb einer der 4 Dateien vermutlich atomar (nicht live mit einem künstlichen Fehler getestet, aber durch 0 Validierungsfehler sehr unwahrscheinlich gemacht); zwischen den 4 Dateien nicht atomar, aber durch Idempotenz trivial wiederherstellbar (einfach erneut ausführen).
- **Backup**: `pre-migration-baseline.json` — vollständiger Snapshot aller 30 aktuell existierenden relevanten Dokumente, erstellt vor jeder Schreiboperation.
- **Wiederherstellung**: ein einziger `sanity documents delete`-Befehl mit den 13 bekannten IDs, vollständig dokumentiert im Dry-Run-Bericht.

## 3. Finale Tests — echte Ergebnisse

| Test | Ergebnis |
|---|---|
| `npx tsc --noEmit` | sauber (mehrfach während der gesamten Runde geprüft) |
| `npm run build` | sauber, alle Routen generiert |
| **Playwright, voller Lauf** | **154/154 bestanden** (mehrfach während der Runde, nach jedem größeren Schritt) |
| DE/TR | Stichprobenartig für jede neue Textstelle im tatsächlich gebauten HTML bestätigt (`grep`), für beide Sprachen |
| SEO | Alle bestehenden SEO-Regressionstests weiterhin grün; keine Metadaten-Struktur verändert |
| Structured Data | Unverändert korrekt (unverändert gegenüber Runde 2) |
| Sanity Content Source | Schema-Erweiterungen (8 statt 5 `editableImages`-Felder) erfolgreich gegen das echte production-Schema validiert (`documents validate`, 0 Fehler); lokaler Modus (`CONTENT_SOURCE` nicht gesetzt) bleibt unverändert die Produktionskonfiguration — bestätigt durch 0 `object-position`-Treffer und identische Bildpfade in jedem Build dieser Runde |
| Bildwechsel-Unabhängigkeit | Echt getestet: ein Vorschaukarten-Bild ausgetauscht (temporärer Testwert), die anderen 3 Karten und der Hero blieben nachweislich unverändert, dann sauber zurückgesetzt |

## 4. Exakte Migrationsfreigabe-Anforderung

Um die Production-Migration (Abschnitt 2) tatsächlich auszuführen, brauche ich von dir **eine der folgenden beiden ausdrücklichen Aussagen**:

- **„Ja, führe `./run-migration.sh production` aus."** — ich führe exakt diesen einen Befehl aus `docs/sanity/migration/` aus, danach melde ich dir das tatsächliche Ergebnis (welche der 13 IDs wirklich angelegt wurden, mit einer erneuten lesenden Kontrollabfrage, nicht nur „sollte geklappt haben").
- **„Teste zuerst gegen `test`."** — ich lege zuerst ein isoliertes `test`-Dataset an, führe dieselbe Migration dort aus, zeige dir das Ergebnis, und warte danach auf eine zweite, separate Freigabe für `production`.

Ohne eine dieser beiden Aussagen bleibt die Migration unverändert im reinen Planungsstand. Keine weitere Rückfrage meinerseits nötig, sobald du eine davon gibst — ich führe dann direkt aus und berichte das reale Ergebnis.

## 5. Lokale Vorschau

Weiterhin erreichbar unter `http://127.0.0.1:3000/de/` und `/tr/` (bestätigt, HTTP 200, während dieser gesamten Runde nie unterbrochen).
