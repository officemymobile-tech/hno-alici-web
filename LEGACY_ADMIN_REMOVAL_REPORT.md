# Legacy-Admin-Entfernung — Audit, Backup & lokale Entfernung

**Datum:** 2026-11-23. **Umfang dieser Runde:** lokale Entfernung aus dem Next.js-Build + Audit + Backup + Cutover-*Plan* für den Cloudflare-Worker. **Kein Push, kein Merge, kein Deployment, keine Abschaltung des live-produktiven Workers, keine Löschung von Secrets/Routen** — wie ausdrücklich festgelegt.

## 1. Vollständige Abhängigkeitsliste (vor jeder Entfernung erstellt)

### Ausschließlich dem alten Admin zugeordnet

| Ressource | Typ | Status |
|---|---|---|
| `public/admin/admin.js`, `admin.css`, `admin-nav.js`, `config.js`, `index.html` | Frontend (Dashboard/Login) | **entfernt** |
| `public/admin/bilder.html`, `bilder.js` | Frontend (Bilder-Editor) | **entfernt** |
| `public/admin/inhalte.html`, `inhalte.js` | Frontend (Inhalte-Editor) | **entfernt** |
| `public/admin/anleitung.html` | Statische Anleitungsseite | **entfernt** |
| `src/lib/announcements.ts`: `getAnnouncementForAdmin()` | Totcode — nirgends sonst aufgerufen, nur für den alten Admin gedacht | **entfernt** |
| `workers/announcement-api.js` | Cloudflare Worker — Backend für alle 3 Admin-Frontends (`/current`, `/update`, `/content`, `/upload-image`) | **live produktiv, NICHT entfernt** (siehe Abschnitt 5/Cutover-Plan) |
| `workers/wrangler.toml` (Worker-Name `hno-alici-announcements`) | Deploy-Konfiguration dieses Workers | **live produktiv, NICHT entfernt** |
| `workers/setup.ps1` | Setup-Skript für diesen Worker | unverändert, nur noch relevant bis zum Cutover |
| Secrets auf `hno-alici-announcements`: `ADMIN_PASSWORD`, `GITHUB_PAT`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_FILE_PATH` | Cloudflare Worker Secrets/Vars | **nicht angefasst** — produktiv aktiv |
| `https://hno-alici-announcements.officemymobile.workers.dev` | Live-Endpunkt (Standard-`workers.dev`-Subdomain, keine Custom-Domain/Route gebunden) | **läuft weiter, seit 2026-06-06 deployed** |

### Gemeinsame Ressourcen — geprüft, **keine gefunden**

Die beiden Systeme waren von Beginn an sauber getrennt angelegt:
- Der alte Admin-Worker (`hno-alici-announcements`) und der neue Sanity-Rebuild-Worker (`hno-alici-sanity-rebuild`) sind zwei unabhängige Cloudflare-Worker-Projekte mit eigenen `wrangler.toml`-Dateien, eigenen Secrets, eigenem Code.
- `src/content/announcements.json` wird von beiden Seiten *gelesen* (alter Worker schrieb hinein, Sanity überlagert es optional), aber das ist die bestehende, bereits korrekt gebaute Fallback-Architektur (`isSanityContentEnabled()`), kein Kopplungsrisiko.
- Es gibt keine gemeinsam genutzte Funktion, Route, Secret oder Konfigurationsdatei zwischen beiden Workern. **Keine Entkopplungsarbeit nötig.**

### Vom neuen Sanity-Workflow benötigt — unverändert erhalten

- `workers/sanity-rebuild-webhook.js`, `workers/wrangler-sanity-rebuild.toml` (Worker-Name `hno-alici-sanity-rebuild`) — noch nicht deployed, Code bereits lokal getestet (siehe `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md`).
- `.github/workflows/deploy.yml`: `repository_dispatch`-Trigger + `CONTENT_SOURCE`-Env-Block.

### Sonstige geprüfte Punkte

- **Navigation/Links zum Admin:** keine gefunden (`grep -rl admin src/components/` → leer). Der alte Admin war nie in der sichtbaren Website verlinkt, nur direkt per URL aufrufbar.
- **Next.js API-Routen:** `src/app/api/` existiert nicht — die Website selbst hatte nie eigene Schreib-Endpunkte; alle Schreibzugriffe liefen ausschließlich über den externen Worker.
- **robots.txt:** enthält weiterhin `disallow: ["/admin/", "/studio/"]`. Harmlos, da der Pfad nicht mehr existiert — bewusst nicht geändert (kein funktionaler Nutzen, zusätzliches Diff-Risiko ohne Gewinn).
- **GitHub Actions:** keine weiteren Workflows außer `deploy.yml`; keiner davon referenziert Admin/Announcements.

## 2. Backup (vor der Entfernung erstellt)

`backups/legacy-admin-removal-2026-11-23/`:
- `git-status-at-backup-time.txt` — vollständiger Status zum Zeitpunkt des Backups.
- `uncommitted-changes-at-backup-time.patch` — vollständiger Diff aller unkommittierten Änderungen (81 Dateien, 25.370 Zeilen).
- `recent-commit-history.txt` — letzte 20 Commits.
- `public-admin/` — physische Kopie aller 10 entfernten Admin-Frontend-Dateien.
- `workers/` — physische Kopie von `announcement-api.js`, `wrangler.toml`, `setup.ps1`.

Zusätzlich bleiben alle entfernten Dateien vollständig in der Git-Historie erhalten (`git log --oneline -- public/admin/` zeigt reale Commits) — wiederherstellbar jederzeit per `git checkout <commit> -- public/admin/`. **Keine Tokens oder Secret-Werte im Backup** — geprüft (nur Secret-*Namen* in Kommentaren, keine Werte; Diff-Treffer für „sk..." waren ausschließlich npm-Package-Checksummen).

## 3. Lokale Entfernung — durchgeführt

- `public/admin/` komplett gelöscht (10 Dateien).
- `getAnnouncementForAdmin()` aus `src/lib/announcements.ts` entfernt (unbenutzter Export).
- `workers/announcement-api.js` + `workers/wrangler.toml` bewusst **nicht** gelöscht — das ist Teil des separat freizugebenden Cutovers (Abschnitt 5 unten / `SANITY_ONLY_PRODUCTION_CUTOVER.md`), nicht dieser Runde.

## 4. Verifikation

| Prüfung | Ergebnis |
|---|---|
| `npx tsc --noEmit` | ✅ sauber |
| `npm run build` | ✅ sauber, **kein** `out/admin/` mehr erzeugt |
| Playwright, voller Lauf | ✅ 154/154 (inkl. des bestehenden `robots.txt disallows /admin/`-Tests, der weiterhin gültig ist) |
| `/admin/` auf dem frisch gebauten, lokal servierten Export | ✅ 404 |
| `/admin/index.html`, `/admin/bilder.html`, `/admin/inhalte.html`, `/admin/anleitung.html` | ✅ 404 (nach Redirect-Normalisierung) |
| `/admin/admin.js`, `.css`, `config.js`, `admin-nav.js` | ✅ 404 direkt |
| `/de/` (Startseite) | ✅ weiterhin 200 |
| `/studio/` (Sanity-Studio-Einbettung) | ✅ weiterhin 200, unverändert |
| Referenzen auf `hno-alici-announcements`/`ADMIN_PASSWORD` im Website-Quellcode (`src/`) | ✅ keine gefunden |
| Verwaiste Legacy-Admin-Dateien sonst im Repo | ✅ keine gefunden (vollständiger Grep-Durchlauf) |

## 5. Was noch auf seine Abschaltung wartet (separate Freigabe nötig)

- Der live produktive Worker `hno-alici-announcements` (seit 2026-06-06 aktiv) — läuft unverändert weiter, bis der Sanity-Workflow vollständig getestet UND ausdrücklich zur Umstellung freigegeben ist.
- Seine 5 Secrets/Vars (`ADMIN_PASSWORD`, `GITHUB_PAT`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_FILE_PATH`).
- Exakter Cutover-Ablauf: siehe `SANITY_ONLY_PRODUCTION_CUTOVER.md`.
