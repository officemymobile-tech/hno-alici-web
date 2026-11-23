# Sanity als alleiniges CMS — Cutover-Plan

**Datum:** 2026-11-23. **Status: Plan fertig, NICHTS davon ausgeführt.** Keine Pushes, Merges, Deployments, Worker-Abschaltungen, Secret-Löschungen, DNS-Änderungen oder produktiven Webhook-Aktivierungen in dieser Runde.

## 1. Sanity-Abdeckung — Bestätigung

Bereits in `SANITY_100_PERCENT_FINAL_STATUS.md` (2026-11-23, frühere Runde) dokumentiert und seither nicht verändert: **62/62 redaktionelle Content-Elemente (100 %)** über Sanity editierbar — DE/TR-Texte, 11 Bildfelder (Hero, Porträts, Team, 4 Startseiten-Karten, 3 Leistungen-Bilder), Öffnungszeiten, Urlaub/Schließzeiten, Leistungen (inkl. aller Unterpunkte/FAQ), Blog, SEO (global + pro Seite + pro Leistung), Navigation-Beschriftungen, komplette Fußzeile. Die 3 bewusst technischen Ausnahmen (Header-Routing-URLs, Terminformular-Struktur, berechnete Öffnungsstatus-Labels) bleiben unverändert im Code, wie ursprünglich gefordert.

**Lokale Inhalte (`src/content/*.json`, `messages/*.json`) bleiben als technischer Rollback-Snapshot erhalten** — sie werden nach dem Cutover von niemandem mehr aktiv redaktionell gepflegt (der alte Admin, der sie schrieb, ist abgeschaltet), dienen aber weiterhin als Fallback, falls `CONTENT_SOURCE=sanity` jemals deaktiviert werden muss. Das ist kein „zweites aktives Redaktionssystem", sondern ausschließlich ein Sicherheitsnetz.

## 2. Voraussetzungen vor dem Cutover (siehe Einzelberichte)

| Bericht | Inhalt |
|---|---|
| `SANITY_FREE_PLAN_COMPATIBILITY.md` | Free-Plan-Grenzen geprüft, vollständig kompatibel |
| `LEGACY_ADMIN_REMOVAL_REPORT.md` | Lokale Entfernung aus dem Website-Build abgeschlossen, Backup vorhanden |
| `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md` | Worker/Webhook/Workflow vorbereitet und so weit wie möglich getestet (2 Punkte BLOCKED, siehe dort) |

## 3. Exakter Cutover-Ablauf (jeder Schritt braucht deine separate Freigabe)

### Phase A — Sanity-Publish-Pipeline aktivieren (siehe GO/NO-GO-Tabelle in `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md`, Punkte 1–8)

Dedizierter CI-Token → GitHub-Secrets → Worker deployen → Worker-Secrets setzen → Sanity-Webhook konfigurieren → `deploy.yml`-Änderung committen/mergen → ersten echten Testlauf beobachten → Entscheidung zur dauerhaften Umstellung.

### Phase B — Website-Build offiziell auf Sanity umstellen

Erst NACH einem erfolgreich beobachteten End-to-End-Testlauf (Phase A, Punkt 7): `CONTENT_SOURCE=sanity` wird mit dem Merge aus Phase A automatisch wirksam — kein separater Schritt nötig, da bereits im selben `deploy.yml`-Block enthalten.

### Phase C — Alten Admin produktiv abschalten (NEU in dieser Runde geplant)

Erst NACHDEM Phase A+B nachweislich stabil laufen (empfohlen: mindestens einen vollen redaktionellen Zyklus lang beobachten):

1. `wrangler deployments list --name hno-alici-announcements` prüfen, dass seit dem Cutover keine neuen Schreibzugriffe mehr eingegangen sind (Worker-Logs).
2. Worker stilllegen: `wrangler delete --name hno-alici-announcements` **oder** zuerst nur den Traffic kappen durch Entfernen der Route/des `*.workers.dev`-Zugriffs, falls ein Zwischenschritt gewünscht ist.
3. Die 5 Worker-Secrets (`ADMIN_PASSWORD`, `GITHUB_PAT`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_FILE_PATH`) sind mit der Worker-Löschung automatisch weg; falls der Worker stattdessen nur deaktiviert statt gelöscht wird, zusätzlich explizit rotieren/löschen.
4. `workers/announcement-api.js`, `workers/wrangler.toml`, `workers/setup.ps1` aus dem Repo entfernen (bleiben bis dahin als Referenz/Backup erhalten, siehe `backups/legacy-admin-removal-2026-11-23/`).
5. `src/content/announcements.json` bleibt als Rollback-Snapshot — wird nur nicht mehr von außen beschrieben.

## 4. Rollback-Plan (pro Phase)

| Phase | Rollback |
|---|---|
| A (Publish-Pipeline) | Sanity-Webhook löschen, `deploy.yml`-Änderung per `git revert` zurücknehmen, Worker-Secrets rotieren/löschen |
| B (Build-Umstellung) | `CONTENT_SOURCE: sanity` aus `deploy.yml` entfernen (git revert) → nächster Build nutzt wieder lokale Inhalte |
| C (Admin-Abschaltung) | Worker aus dem Backup (`backups/legacy-admin-removal-2026-11-23/workers/`) neu deployen, Secrets neu setzen, `public/admin/` aus dem Backup oder der Git-Historie wiederherstellen |

## 5. Secrets, die später widerrufen werden müssen (Namen only, keine Werte)

- `ADMIN_PASSWORD`, `GITHUB_PAT` (alter Worker) — bei Cutover-Phase C.
- Der im Zuge dieser Prüfung angefragte, aber **nicht erstellte** dedizierte CI-Lese-Token für Sanity — noch gar nicht angelegt, daher auch nichts zu widerrufen.

## 6. Offene Punkte / Entscheidung bei dir

- Exakter Zeitpunkt für Phase C (wie lange soll der alte Admin nach dem Cutover noch als Notfall-Fallback bereitstehen?).
- Ob der dedizierte CI-Token jetzt angelegt werden soll (dafür wird entweder die Bash-Berechtigung für `sanity tokens add` benötigt, oder du legst ihn selbst im Sanity-Dashboard an).
