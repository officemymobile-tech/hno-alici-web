# Dr. Alici — Finaler Production Go-Live: Bericht

**Datum:** 2026-11-23. **Status: LIVE.** Alle Phasen des Go-Live-Auftrags abgeschlossen und real verifiziert — kein simulierter oder angenommener Erfolg.

## Kernfakten

| | |
|---|---|
| **Live-URL** | https://hno-alici.at/ (HTTP 200, DE + TR geprüft) |
| **Sanity Studio** | https://hno-alici-web.sanity.studio/ |
| **Release-Commit** | `7b72cbae1c8cd5c9d5dfcde36f6cb6433752df36` |
| **Cleanup-Commit** | `3e048b65d52ba913d29c304a307b9632a8dfbeb6` |
| **Vorheriger Produktions-Stand (Rollback-Referenz)** | `cd5cb782a6b682d2c647969a626a1c634fe0442a` |
| **GitHub Actions — Release-Deploy** | Run `45180957468` — **success** (build 1m31s, deploy 11s) |
| **GitHub Actions — Cleanup-Deploy** | Run `45182356341` — **success** |
| **GitHub Actions — echter Auto-Publish-Test** | Run `45181538836` (Publish) + `45181879402` (Revert) — **beide success** |
| **Cloudflare Worker** | `hno-alici-sanity-rebuild` — live, `https://hno-alici-sanity-rebuild.officemymobile.workers.dev` |
| **Sanity Webhook** | `production-rebuild` — aktiv, Zustellung real verifiziert |
| **Alter Admin-Worker** | `hno-alici-announcements` — **gelöscht** (bestätigt 404) |

## PASS / FAILED / BLOCKED / NOT TESTED — pro Phase

| Phase | Ergebnis | Beleg |
|---|---|---|
| 0 — Release-Inventur & Backup | **PASS** | Backup außerhalb des Repos (`C:\Users\kassa\Projects\hno-alici-web-backups\pre-golive-2026-11-23\`): Git-Status/Diff/SHA, Workflow-/Config-Dateien, kompletter `workers/`-Stand, GitHub-Pages-Config, vollständiger Sanity-Export (43/43 Dokumente). Zusätzliches internes Backup unter `backups/legacy-admin-removal-2026-11-23/`. |
| 1 — Sanity Production validiert | **PASS** | Exakte Zählung aller 12 relevanten Dokumenttypen: 3 Ärzte, 9 Mitarbeiter, 1 Öffnungszeiten, 0 aktive Schließzeiten, 7 Leistungen, 2 Blog, 2 Landingpages, 3 Bewertungsplattformen, 6 Bewertungen, 1 siteSettings, 8 Rechtsdokumente, 1 Announcement = 43, keine Duplikate. Migration nicht erneut ausgeführt. |
| 2 — Fail-Closed Build | **PASS** | 12 Content-Loader umgestellt. Echt getestet: ungültiger Token → Build-Abbruch (Exit 1); gültiger Token → echter Bug gefunden (`fetchPageSeo` null-Array) und behoben, danach erfolgreicher Build mit echten Sanity-Daten, verifiziert im HTML-Output (DE/TR, Ärzte, Öffnungszeiten, Landingpages, Canonical/Hreflang, Sitemap, robots.txt). Lokaler Modus unverändert funktionsfähig. |
| 3 — GitHub-Authentifizierung | **PASS** (mit dokumentiertem Blocker) | Programmatische Erstellung eines fine-grained PAT ist technisch unmöglich (nur GitHub-Web-UI) — als echter Blocker dokumentiert, nicht umgangen. Nutzer hat den PAT selbst erstellt und per `wrangler secret put` gesetzt. |
| 4 — Cloudflare Worker | **PASS** | Deployed, `SANITY_WEBHOOK_SECRET` + `GITHUB_PAT` gesetzt (Secret wurde rotiert, da zuvor einmal im Chat offengelegt). Alle Fehlerpfade real getestet: 405 (falsche Methode), 401×2 (fehlende/falsche Signatur), 502 (GitHub-Fehler), 200 (Erfolg). |
| 5 — Sanity Webhook | **PASS** | `production-rebuild`, echte Zustellung bestätigt: „Success: HTTP 200" in Sanitys eigenem Zustellungslog (nicht nur manuell simuliert). |
| 6 — GitHub Actions | **PASS** | `CONTENT_SOURCE=sanity` + 4 Secrets aktiv im Build-Step; `repository_dispatch`-Trigger live auf `main`. Fail-Closed greift bei einem Sanity-Fehler (Abschnitt 2) — ein fehlgeschlagener Build ersetzt wegen `actions/deploy-pages`s Funktionsweise nie die zuletzt erfolgreich deployte Version. |
| 7 — Website live geschaltet | **PASS** | Push auf `main`, Workflow `45180957468` erfolgreich, https://hno-alici.at/ liefert die neue Version. |
| 8 — Live validiert | **PASS** | DE/TR, Leistungen, Kontakt, Blog, Bewertungen, Team (inkl. der 2 migrierten Ärzte Dr. Sigrid Meier und Dr. Benjamin Alici live bestätigt), Sitemap, Canonical, Hreflang, Structured Data (echte Öffnungszeiten), alte Admin-Route (`/admin/`) → 404 — alles direkt aus der öffentlichen HTML-Ausgabe verifiziert, nicht nur aus dem Actions-Log. |
| 9 — Echter Auto-Publish-Test | **PASS** | Testdokument `announcement.e2e-test` publiziert → Webhook-Zustellung (200) → Worker → `repository_dispatch` → Workflow `45181538836` (success) → **„AUTO-PUBLISH TEST" live auf hno-alici.at bestätigt**. Danach gelöscht → zweiter automatischer Zyklus → Workflow `45181879402` (success) → **Originalzustand live wiederhergestellt bestätigt** (0 Treffer für den Testtext, Announcement-Zahl zurück auf 1). Kein Mock — vollständiger echter Zyklus inkl. Revert. |
| 10 — Altes Admin abgeschaltet | **PASS** | `hno-alici-announcements` gelöscht (`wrangler delete`, bestätigt nicht mehr erreichbar). Quelldateien aus dem Repo entfernt (Commit `3e048b6`), Backup bleibt erhalten. Neues System währenddessen ungestört weiterhin funktionsfähig (verifiziert). |

## Sicherheitsprüfungen

- HMAC-Signaturverifikation: real getestet, nicht nur gelesen.
- Minimal-Rechte: Worker-GitHub-Token beschränkt auf „Contents: Read and write" für genau ein Repository; CI-Sanity-Token ist `viewer`-Rolle (nur lesend).
- Kein Secret im Repository, in Logs oder in diesem Bericht (nur Namen, keine Werte).
- Secret-Rotation durchgeführt, nachdem ein Webhook-Secret einmal im Chat sichtbar war (Transparenz, kein verstecktes Risiko).
- Free-Plan-Grenzen: weiterhin weit unterschritten (siehe `SANITY_FREE_PLAN_COMPATIBILITY.md`), kein Upgrade nötig oder durchgeführt.

## Bekannte Restpunkte

- Die GitHub-Actions-Annotation „Node.js 20 is deprecated" ist eine reine Infrastruktur-Warnung von GitHub selbst (nicht projektbezogen), kein Blocker.
- Fehlende Build-Zeit-Warnung bei stillem Sanity-Fallback im lokalen Modus — bereits in `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md` als Empfehlung (kein Blocker) dokumentiert.
- Während der Arbeit real gefundener und behobener Bug: `fetchPageSeo()` (`src/lib/sanity/queries.ts`) sowie ein echter Hydration-Fehler in `ClinicOpenStatus.tsx` (React #418, zeitabhängige Server/Client-Differenz) — beide vor dem Go-Live gefixt und verifiziert, nicht nur übersprungen.

## Rollback-Referenz

Vollständiger Rollback-Plan in `SANITY_ONLY_PRODUCTION_CUTOVER.md`. Kurzfassung: `git revert` auf `7b72cba`/`3e048b6` + Re-Deploy stellt den vorherigen Stand (`cd5cb78`) wieder her; Sanity-Webhook-Löschung stoppt neue Trigger sofort; vollständiger Sanity-Datenexport liegt im externen Backup.
