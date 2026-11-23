# Production-Migration — Ergebnisbericht

**Datum:** 2026-11-23. **Umfang:** ausschließlich die 13 im `DRY_RUN_REPORT.md` dokumentierten Dokumente, gegen das `production`-Dataset (`qhrodl8k`). Diese Migration betrifft ausschließlich Sanity-Inhaltsdaten — **keine Veröffentlichung der neuen Website**, kein Push, kein Merge, kein Deployment, keine DNS-Änderung.

## Status: Erfolgreich abgeschlossen, alle 10 Bedingungen erfüllt

| # | Bedingung | Ergebnis |
|---|---|---|
| 1 | Zustand vor dem Schreiben erneut geprüft und gesichert | ✅ Frischer Snapshot `docs/sanity/migration/pre-migration-baseline-2026-11-23b.json` — 30 bestehende Dokumente, identisch zum vorherigen Stand |
| 2 | 13 IDs/Inhalte mit dem erfolgreichen Testlauf verglichen | ✅ Exakt dieselben 13 IDs, dieselben Quelldateien — keine Abweichung zum Testlauf vom selben Tag |
| 3 | Abbruch bei bestehenden IDs/Konflikten | Nicht nötig — exakte Kollisionsprüfung ergab `[]` (keine der 13 IDs existierte), kein Abbruch ausgelöst |
| 4 | Keine bestehenden Dokumente überschrieben/gelöscht | ✅ Explizit verifiziert: `doctor.dr-uemit-alici` unverändert vorhanden; alle anderen 29 bestehenden Dokumente (gleiche ID-Menge, vorher/nachher verglichen) komplett unverändert |
| 5 | Alle 13 Dokumente nach der Migration vollständig gegen Quelldaten verglichen | ✅ Programmatischer Feld-für-Feld-Vergleich aller 13 — **vollständiger Match**, keine Abweichung |
| 6 | Migration erneut im Idempotenz-Modus geprüft | ✅ Zweiter Lauf: alle 13 als „Skipped (already exists)" gemeldet; Zählung unverändert bei 14 (13 neu + 1 bestehend) |
| 7 | Keine Änderungen an anderen Sanity-Dokumenten | ✅ Verifiziert — exakte ID-Mengen-Übereinstimmung für alle 29 übrigen Dokumente |
| 8 | Keine Pushes/Merges/Deployments/DNS-Änderungen | ✅ Keine ausgeführt |
| 9 | Kein automatisches Rollback bei Unklarheit | Nicht ausgelöst — es gab keine unklare Fehlersituation; jeder Schritt lieferte ein eindeutiges, erwartetes Ergebnis |
| 10 | Dieser Bericht | ✅ |

## Tatsächlich durchgeführte Schritte, mit echten Ergebnissen

### 1. Vorprüfung (vor jeder Schreiboperation)
```
npx sanity documents query '*[_id in [... die 13 IDs ...]]{_id,_type}' --project qhrodl8k --dataset production
→ []
```
Keine Kollision. Frischer Backup-Snapshot erstellt (30 Dokumente, 8 Typen — identisch zum Stand vom Testlauf).

Zusätzlich erneute Schema-Validierung direkt vor dem Schreiben:
```
✔ Valid: 13 documents · Errors: 0 · Warnings: 0
```

### 2. Migration ausgeführt
```
./run-migration.sh production
```
Alle 13 Dokumente mit Status **„Created"** gemeldet (nicht „Skipped" — bestätigt, dass tatsächlich neu geschrieben wurde, nicht nur ein Idempotenz-Treffer):
- `doctor.dr-sigrid-meier`, `doctor.dr-benjamin-alici`
- `reviewPlatform.google`, `reviewPlatform.docfinder`, `reviewPlatform.herold`
- `patientReview.1` bis `patientReview.6` (alle 6)
- `landingPage.turkishHno`, `landingPage.kinderHno`

### 3. Vollständiger Inhaltsvergleich nach der Migration
Alle Dokumente der 4 betroffenen Typen aus `production` abgerufen: **14 Treffer** (13 neue + der bereits bestehende `doctor.dr-uemit-alici`) — exakt wie erwartet. Jedes der 13 neuen Dokumente Feld für Feld gegen die Quelldateien verglichen:
```
ALL 13 PRODUCTION DOCUMENTS: FULL FIELD-BY-FIELD MATCH CONFIRMED
Pre-existing doctor.dr-uemit-alici still present: true - name: Dr. Ümit Alici
```

### 4. Idempotenz-Kontrolle (zweiter Lauf)
```
./run-migration.sh production
```
Alle 13 als **„Skipped (already exists)"** gemeldet. Zählung bestätigt: `count(*[_type in [...]]) = 14` (unverändert) und Gesamtzahl aller relevanten Dokumenttypen = `43` (= 30 vorher + 13 neu, exakt stimmig).

### 5. Unversehrtheit der übrigen Daten
Alle 29 anderen, bereits bestehenden Dokumente (9 `staffMember`, 1 `openingHours`, 1 `announcement`, 7 `service`, 2 `blogPost`, 1 `siteSettings`, 8 `legalDocument`) erneut abgerufen und als exakt identische ID-Menge gegenüber dem Vortages-Stand bestätigt — nichts gelöscht, nichts unerwartet verändert oder hinzugefügt.

## Was sich dadurch auf der Live-Website ändert

**Nichts, solange `CONTENT_SOURCE=sanity` nicht aktiv ist** — und das ist es weiterhin nicht (unverändert, keine Umschaltung in dieser oder einer früheren Runde vorgenommen). Diese Migration hat ausschließlich die Sanity-Datenbasis vervollständigt; die Website liest weiterhin aus den lokalen Dateien, exakt wie zuvor.

## Verbleibender Stand

- **Alle 13 Dokumente sind jetzt real in `production` vorhanden**, inhaltlich geprüft, idempotent bestätigt.
- Ein eigenständiges Foto für Dr. Sigrid Meier als Sanity-Asset wurde weiterhin nicht hochgeladen (wie im ursprünglichen `MIGRATION_PLAN.md` dokumentiert — der bestehende Fallback-Mechanismus zeigt ihr reales Foto trotzdem korrekt an).
- Für eine künftige Umschaltung auf `CONTENT_SOURCE=sanity` in Production bleibt weiterhin eine gesonderte, eigene Freigabe erforderlich — diese Migration deckt ausdrücklich nur die Dateninhalte ab, nicht die Aktivierung.
