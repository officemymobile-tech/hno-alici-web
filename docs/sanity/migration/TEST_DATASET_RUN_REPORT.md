# Migration — vollständiger Testlauf gegen isoliertes `test`-Dataset

**Datum:** 2026-11-23. **production wurde zu keinem Zeitpunkt beschrieben** — jeder Schritt lief ausschließlich gegen ein eigens angelegtes, isoliertes `test`-Dataset, das am Ende wieder vollständig gelöscht wurde.

## Ablauf und tatsächliche Ergebnisse

### 1. Isoliertes Dataset angelegt
```
npx sanity dataset create test --visibility private
```
→ erfolgreich.

### 2. Temporäres Editor-Token erstellt
Label `Migration-Dry-Run-Test`, Rolle `editor`, Ablauf 2026-11-24 — als Sicherheitsnetz vorbereitet. **Tatsächlich nicht benötigt**: `documents create/query/delete` liefen über die bereits authentifizierte Sanity-CLI-Session, nicht über dieses Token. Es wurde dennoch am Ende ordnungsgemäß widerrufen (Abschnitt 6).

### 3. Vollständige Migration ausgeführt (`./run-migration.sh test`)
Alle 13 Dokumente wurden tatsächlich erstellt:
```
--- 1/4: doctors ---
Created: doctor.dr-sigrid-meier, doctor.dr-benjamin-alici
--- 2/4: review platforms ---
Created: reviewPlatform.google, reviewPlatform.docfinder, reviewPlatform.herold
--- 3/4: patient reviews ---
Created: patientReview.1 … patientReview.6 (alle 6)
--- 4/4: landing pages ---
Created: landingPage.turkishHno, landingPage.kinderHno
```

### 4. Inhalt geprüft — vollständiger, programmatischer Feld-für-Feld-Vergleich
Alle 13 Dokumente per `documents query` aus dem `test`-Dataset abgerufen und **jedes einzelne Feld** gegen die 4 Quelldateien (`01-doctors.json` … `04-landing-pages.json`) verglichen (nicht nur stichprobenartig):

```
ALL 13 DOCUMENTS: FULL FIELD-BY-FIELD MATCH CONFIRMED
```

### 5. Idempotenz getestet — Migration ein zweites Mal ausgeführt
```
--- 1/4: doctors ---
Skipped (already exists): doctor.dr-sigrid-meier, doctor.dr-benjamin-alici
--- 2/4: review platforms ---
Skipped (already exists): reviewPlatform.google, reviewPlatform.docfinder, reviewPlatform.herold
--- 3/4: patient reviews ---
Skipped (already exists): patientReview.1 … patientReview.6 (alle 6)
--- 4/4: landing pages ---
Skipped (already exists): landingPage.turkishHno, landingPage.kinderHno
```
Anschließende Zählung: `count(*[_type in [...]]) = 13` — **exakt dieselbe Zahl wie nach dem ersten Lauf, keine Duplikate.** Das zuvor nur aus der CLI-Dokumentation zitierte `--missing`-Verhalten ist damit live bestätigt, nicht nur behauptet.

### 6. Rollback getestet
```
npx sanity documents delete doctor.dr-sigrid-meier doctor.dr-benjamin-alici reviewPlatform.google reviewPlatform.docfinder reviewPlatform.herold patientReview.1 patientReview.2 patientReview.3 patientReview.4 patientReview.5 patientReview.6 landingPage.turkishHno landingPage.kinderHno --project qhrodl8k --dataset test
```
→ **„Deleted 13 documents"** — exakt die erwartete Anzahl.

Kontrolle danach: `count(*[_type in [...]])` lieferte keine Treffer mehr (0). Die 11 übrig gebliebenen Einträge im Dataset (`*[]`) waren ausschließlich Sanitys eigene interne System-Dokumente (`system.group`-Berechtigungsgruppen, `system.retention`-Richtlinie) — diese existieren automatisch in jedem neu angelegten Dataset und haben nichts mit der Migration zu tun. **Rollback vollständig erfolgreich, keine Reste der Migrationsdaten.**

### 7. Aufräumen
- `test`-Dataset vollständig gelöscht (`npx sanity dataset delete test --force`).
- Temporäres Token widerrufen (`npx sanity tokens delete g-bRE4xaGHTNC2`) — anschließend `tokens list` bestätigt: **0 Tokens vorhanden.**
- `production` erneut per lesender Abfrage geprüft: weiterhin **nur** `doctor.dr-uemit-alici` — unverändert seit Beginn dieser gesamten Migrationsplanung.

## Fazit

| Prüfung | Ergebnis |
|---|---|
| Alle 13 Dokumente erstellt | ✅ |
| Inhalt vollständig korrekt (Feld-für-Feld) | ✅ |
| Idempotenz (2. Lauf = 0 Duplikate) | ✅ |
| Rollback (0 Reste) | ✅ |
| `production` unberührt | ✅ (durchgehend verifiziert) |
| Temporäres Token widerrufen | ✅ |
| Push/Merge/Deployment | keine |

Die Migration ist damit **vollständig funktional bewiesen** — nicht nur schema-valide (wie im vorherigen Dry-Run), sondern tatsächlich ausgeführt, inhaltlich verifiziert, idempotent und rückabwicklbar getestet. Für `production` steht weiterhin dieselbe, noch nicht erteilte Freigabe aus wie zuvor.
