# Migration Dry-Run Report — `./run-migration.sh production`

**Erstellt:** 2026-11-23. **Status: reine Prüfung, nichts geschrieben.** Jeder Befehl in diesem Bericht war entweder eine lesende Abfrage (`documents query`) oder eine Schema-Validierung gegen eine lokale Datei (`documents validate --file`, die Sanity selbst beschreibt als Prüfung "gegen das Studio-Schema" — sie schreibt nichts, auch wenn sie sich kurz mit dem Projekt verbindet, um das Schema zu laden).

## 1. Vollständige Liste: welche 13 Dokumente erstellt würden

| # | `_id` | `_type` | Quelle |
|---|---|---|---|
| 1 | `doctor.dr-sigrid-meier` | `doctor` | `01-doctors.json` |
| 2 | `doctor.dr-benjamin-alici` | `doctor` | `01-doctors.json` |
| 3 | `reviewPlatform.google` | `reviewPlatform` | `02-review-platforms.json` |
| 4 | `reviewPlatform.docfinder` | `reviewPlatform` | `02-review-platforms.json` |
| 5 | `reviewPlatform.herold` | `reviewPlatform` | `02-review-platforms.json` |
| 6 | `patientReview.1` | `patientReview` | `03-patient-reviews.json` |
| 7 | `patientReview.2` | `patientReview` | `03-patient-reviews.json` |
| 8 | `patientReview.3` | `patientReview` | `03-patient-reviews.json` |
| 9 | `patientReview.4` | `patientReview` | `03-patient-reviews.json` |
| 10 | `patientReview.5` | `patientReview` | `03-patient-reviews.json` |
| 11 | `patientReview.6` | `patientReview` | `03-patient-reviews.json` |
| 12 | `landingPage.turkishHno` | `landingPage` | `04-landing-pages.json` |
| 13 | `landingPage.kinderHno` | `landingPage` | `04-landing-pages.json` |

**Geändert würde: 0 Dokumente.** Dies ist eine rein additive Migration — jede ID ist neu.

## 2. Vollständige Feldinhalte

Jedes Feld ist wörtlich in den 4 Quelldateien einsehbar (`01-doctors.json` bis `04-landing-pages.json`, je im selben Ordner wie dieser Bericht). Zur Kontrolle hier die exakte Feldanzahl pro Dokumenttyp:

- **`doctor`** (2×): `name`, `isPrimary`, `clinicalTitle.{de,tr}` — kein `portrait` gesetzt (siehe Abschnitt 5 im `MIGRATION_PLAN.md`, bewusste Lücke, kein erfundenes Bild).
- **`reviewPlatform`** (3×): `name`, `rating`, `maxRating`, `reviewCount`, `url`, optional `writeReviewUrl` (nur bei Google gesetzt, identisch zu `url`).
- **`patientReview`** (6×): `rating`, `title.{de,tr}`, `text.{de,tr}`, `author`, `source`, optional `originalLocale` (nur bei #2 gesetzt: `"en"`), `order`, `active: true`.
- **`landingPage`** (2×): `slugKey`, `title.{de,tr}`, `h1.{de,tr}`, `metaDescription.{de,tr}`, `keywords[]`, `hero.{de,tr}`, `benefits.{de,tr}[]`.

## 3. Bereits vorhandene Dokumente — exakte Kollisionsprüfung

```
npx sanity documents query '*[_id in ["doctor.dr-sigrid-meier","doctor.dr-benjamin-alici","reviewPlatform.google","reviewPlatform.docfinder","reviewPlatform.herold","patientReview.1",...,"landingPage.turkishHno","landingPage.kinderHno"]]{_id,_type}' --project qhrodl8k --dataset production
```

**Ergebnis: `[]` — leeres Array.** Keine einzige der 13 geplanten IDs existiert aktuell in `production`. Null Kollisionsrisiko, exakt geprüft (nicht die breitere Typ-Abfrage von gestern, sondern die genauen 13 IDs selbst).

Vollständiger Snapshot aller 30 aktuell existierenden, für die Migration relevanten Dokumente: `pre-migration-baseline.json` (siehe Abschnitt 6).

## 4. Echte Schema-Validierung (nicht nur behauptet)

```
npx sanity documents validate --file migration-all.ndjson --project qhrodl8k --dataset production --level info --yes
```

**Tatsächliche Ausgabe:**
```
✔ Loaded workspace 'default' using project 'qhrodl8k' and dataset 'production'
✔ Checked all references (0.0s)
✔ Validated 13 documents (0.0s)

Validation results:
✔ Valid:    13 documents
✖ Errors:   0 documents, 0 errors
⚠ Warnings: 0 documents, 0 warnings
ℹ Info:     0 documents, 0 markers
```

Alle 13 Dokumente sind **schemakonform**, geprüft gegen das echte, aktuell deployte Schema — kein einziger Validierungsfehler, keine Warnung. `migration-all.ndjson` (die zusammengeführte Datei für diesen Befehl) liegt im selben Ordner.

## 5. Verhalten bei erneutem Ausführen

Laut Sanity-CLI-Dokumentation (`sanity documents create --help`):

> `--missing`: On duplicate document IDs, don't modify the target document(s)

Ein zweiter Durchlauf von `./run-migration.sh production`, nachdem die 13 Dokumente einmal erstellt wurden, würde für jede der 13 IDs feststellen, dass sie bereits existiert, und **nichts verändern** — das Skript liefe durch, ohne eine einzige Schreiboperation auszulösen. Dasselbe gilt, wenn das Skript ein zweites Mal aus Versehen gestartet wird.

## 6. Verhalten bei Fehlern (ehrlich eingeordnet — teils dokumentiertes Verhalten, teils begründete Einschätzung, nicht live mit einem echten Fehler getestet)

Das Skript ruft `documents create` **viermal** auf (einmal je Datei: Ärzte, Plattformen, Bewertungen, Landingpages) und nutzt `set -e`, bricht also beim ersten fehlschlagenden Schritt ab.

- **Innerhalb einer der 4 Dateien** (z. B. scheitert eines der 6 `patientReview`-Dokumente): die genaue Atomizität hängt von Sanitys Mutate-API ab, die mehrere Dokumente in einem Aufruf typischerweise als eine Transaktion behandelt — ein Fehler bei einem Dokument würde wahrscheinlich die gesamte Datei zurückrollen, nicht nur das eine Dokument. Da die Schema-Validierung bereits 0 Fehler zeigt (Abschnitt 4), ist dieses Szenario unwahrscheinlich, wenn auch nicht mit einem künstlich erzeugten Fehler live getestet.
- **Zwischen den 4 Dateien** (z. B. Schritt 1 „Ärzte" gelingt, Schritt 2 „Plattformen" scheitert an einem Netzwerkfehler): Schritt 1s Dokumente **bleiben bestehen** (keine automatische Rückabwicklung über Dateigrenzen hinweg), das Skript bricht ab, Schritte 3–4 laufen nicht.
- **Wiederherstellung nach einem Teilfehler ist trivial**: Da `--missing` idempotent ist, genügt es, **dasselbe Skript einfach erneut zu starten** — bereits erstellte Dokumente werden übersprungen, die Migration setzt genau dort fort, wo sie abgebrochen ist. Keine manuelle Aufräumarbeit nötig.

## 7. Backup und Wiederherstellung

- **Backup (bereits erstellt, read-only):** `pre-migration-baseline.json` — eine vollständige Liste aller 30 aktuell existierenden, für diese Migration relevanten Dokument-IDs (1 `doctor`, 9 `staffMember`, 1 `openingHours`, 1 `announcement`, 7 `service`, 2 `blogPost`, 1 `siteSettings`, 8 `legalDocument`; 0 `closurePeriod`/`reviewPlatform`/`patientReview`/`landingPage`), erzeugt am 2026-11-23 vor jeder Schreiboperation.
- **Wiederherstellung (Rollback):** Da die Migration ausschließlich **neue** Dokumente anlegt (keine bestehenden werden verändert — durch `--missing` technisch erzwungen), bedeutet ein Rollback einfach: die 13 neuen IDs wieder löschen.
  ```
  npx sanity documents delete doctor.dr-sigrid-meier doctor.dr-benjamin-alici reviewPlatform.google reviewPlatform.docfinder reviewPlatform.herold patientReview.1 patientReview.2 patientReview.3 patientReview.4 patientReview.5 patientReview.6 landingPage.turkishHno landingPage.kinderHno --project qhrodl8k --dataset production
  ```
  Danach entspricht der Datenbestand wieder exakt dem in `pre-migration-baseline.json` festgehaltenen Zustand — verifizierbar mit derselben Abfrage aus Abschnitt 3.

## 8. Fazit dieses Dry-Runs

- 13 Dokumente, 0 Kollisionen, 0 Validierungsfehler, vollständig idempotent, vollständig rückabwickelbar.
- **Noch immer nichts geschrieben.** Dieser Bericht ist eine reine Prüfung.
- Freigabe-Anforderung unverändert: ein explizites „Ja, führe `./run-migration.sh production` aus" — danach wird die Migration in diesem selben Format mit dem tatsächlichen Ergebnis protokolliert, nicht nur als „sollte funktioniert haben" gemeldet.
