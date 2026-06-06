# Mitteilungen / Duyurular – Admin ohne GitHub

Die Ordination kann **tägliche Hinweise** selbst pflegen — **ohne Ihr persönliches GitHub-Konto**.

- **Admin-URL:** https://hno-alici.at/admin/
- **Website:** Banner oben auf allen Seiten (wenn aktiv)

---

## Für die Ordination (tägliche Nutzung)

1. Browser öffnen: **https://hno-alici.at/admin/**
2. Texte auf **Deutsch** und **Türkisch** eintragen
3. Optional: „Gültig bis“ setzen (z. B. nur heute)
4. **Ordinations-Passwort** eingeben (vom Techniker — **nicht** GitHub)
5. **Veröffentlichen** klicken
6. Nach ca. **2–3 Minuten** erscheint der Hinweis auf der Website

**Ausblenden:** Button „Ausblenden (deaktivieren)“ — Passwort eingeben, fertig.

---

## Einmalige Einrichtung (nur Techniker / Sie)

GitHub-Zugangsdaten geben Sie **niemandem** aus der Ordination. Stattdessen läuft ein kleiner **Cloudflare Worker** (kostenlos), der mit einem **eigenen GitHub-Token** die Datei im Repository aktualisiert.

### 1. GitHub: Fine-grained Personal Access Token

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens** → **Generate**
2. Repository: nur **officemymobile-tech/hno-alici-web**
3. Berechtigung: **Contents → Read and write**
4. Token kopieren und sicher aufbewahren (nur für den Worker)

### 2. Cloudflare Worker deployen (ein Befehl)

Voraussetzung: [Cloudflare](https://dash.cloudflare.com)-Konto (kostenlos) und `wrangler login`.

```powershell
cd hno-alici-web/workers
npx wrangler login
.\setup.ps1 -GitHubPat "IHR_FINE_GRAINED_TOKEN" -AdminPassword "IHR_ORDINATIONS_PASSWORT"
```

Das Skript setzt die Secrets, deployt den Worker und trägt die URL automatisch in `public/admin/config.js` ein.

Danach **committen und pushen** → GitHub Pages baut neu.

### 4. Passwort an die Ordination

- Nur das **ADMIN_PASSWORD** (Ordinations-Passwort) weitergeben
- **Nicht:** Ihr GitHub-Passwort, **nicht** der GITHUB_PAT

---

## Technik (kurz)

| Teil | Rolle |
|------|--------|
| `src/content/announcements.json` | Inhalt der Mitteilung |
| `AnnouncementBanner` | Anzeige auf der Website |
| `public/admin/` | Formular für die Ordination |
| Cloudflare Worker | Speichert JSON via GitHub API |
| GitHub Actions | Baut die Website nach jedem Push neu |

---

## Datenschutz

- Es werden nur die eingegebenen **Hinweistexte** gespeichert (keine Patientendaten).
- Das Passwort liegt nur als Geheimnis beim Cloudflare Worker, nicht im Website-Code.
- Admin-Seite ist per `noindex` von Suchmaschinen ausgeschlossen.

---

## Alternative ohne Cloudflare

Falls gewünscht, kann die Ordination Mitteilungen auch direkt in GitHub bearbeiten — dafür bräuchte sie ein **eigenes** GitHub-Konto (nicht Ihres) mit Schreibrecht nur auf dieses Repository. Die Worker-Lösung ist für die Praxis meist einfacher.
