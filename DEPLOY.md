# Deployment hno-alici.at – GitHub Pages + Ionos

## Aktueller Status

| Punkt | Status |
|-------|--------|
| GitHub Repo | https://github.com/officemymobile-tech/hno-alici-web |
| GitHub Actions Deploy | ✅ Erfolgreich (bei Push auf `main`) |
| GitHub Pages Custom Domain | `hno-alici.at` eingetragen |
| Ionos DNS | ❌ Zeigt noch auf altes WordPress (`217.160.0.130`) |

**Die neue Website ist bereit** – sie wird sichtbar, sobald die DNS-Einträge bei Ionos umgestellt sind.

---

## 1. GitHub Pages (bereits eingerichtet)

- Workflow: `.github/workflows/deploy.yml`
- Nach jedem Push auf `main` wird automatisch gebaut und veröffentlicht
- Einstellungen: https://github.com/officemymobile-tech/hno-alici-web/settings/pages
  - **Source:** GitHub Actions
  - **Custom domain:** `hno-alici.at`

Nach DNS-Umstellung zusätzlich:
- „Enforce HTTPS“ aktivieren (Checkbox in GitHub Pages Settings)

---

## 2. Ionos DNS umstellen (manuell – einmalig)

### Schritt-für-Schritt im Ionos-Kundenbereich

1. Einloggen: https://www.ionos.de/
2. **Domains & SSL** → Domain **`hno-alici.at`** auswählen
3. **DNS** / **DNS-Einstellungen** öffnen
4. **Alle alten Einträge löschen**, die auf WordPress/Hosting zeigen:
   - A-Records mit `217.160.0.130` oder ähnlichen Ionos-Hosting-IPs
   - AAAA-Records mit `2001:8d8:...` (Ionos IPv6)
   - CNAME `www` → altes Hosting
5. **Neue Einträge anlegen:**

#### Apex-Domain (hno-alici.at)

| Typ | Host / Name | Wert | TTL |
|-----|-------------|------|-----|
| **A** | `@` (oder leer) | `185.199.108.153` | 3600 |
| **A** | `@` | `185.199.109.153` | 3600 |
| **A** | `@` | `185.199.110.153` | 3600 |
| **A** | `@` | `185.199.111.153` | 3600 |
| **AAAA** | `@` | `2606:50c0:8000::153` | 3600 |
| **AAAA** | `@` | `2606:50c0:8001::153` | 3600 |
| **AAAA** | `@` | `2606:50c0:8002::153` | 3600 |
| **AAAA** | `@` | `2606:50c0:8003::153` | 3600 |

#### www-Subdomain

| Typ | Host / Name | Wert | TTL |
|-----|-------------|------|-----|
| **CNAME** | `www` | `officemymobile-tech.github.io` | 3600 |

> **Hinweis Ionos:** Das Root-Feld heißt oft `@` oder bleibt **leer** für die Hauptdomain. Pro IP nur einen A-Eintrag – bei Ionos ggf. vier separate A-Records anlegen.

### DNS prüfen (nach 15 Min – 48 Std.)

```powershell
nslookup hno-alici.at
# Erwartet: 185.199.108.153 (oder eine der anderen GitHub-IPs)

nslookup www.hno-alici.at
# Erwartet: officemymobile-tech.github.io
```

### Live testen

- https://hno-alici.at/de/ – deutsche Startseite
- https://hno-alici.at/tr/ – türkische Startseite

---

## 3. WordPress abschalten

Nach erfolgreichem Test:

- WordPress-Hosting bei Ionos deaktivieren oder Domain-Verknüpfung entfernen
- Alte Site nicht parallel laufen lassen (SEO-Duplikate vermeiden)

---

## Alternative: Vercel (optional)

Für SSR, Edge-Middleware und `vercel.json` Security-Headers ohne GitHub-Pages-Einschränkungen:

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

Ionos DNS bei Vercel:

| Typ | Host | Wert |
|-----|------|------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Dafür `output: "export"` in `next.config.ts` entfernen und GitHub-Pages-Workflow deaktivieren.

---

## Lokal testen

```bash
npm run build
npx serve out
# http://localhost:3000/de/
```

## SEO Report

```bash
node scripts/seo-report.mjs
```
