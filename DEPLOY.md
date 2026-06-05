# Deployment hno-alici.at – GitHub Pages + Ionos

## 1. GitHub Pages aktivieren (einmalig)

1. Öffnen: https://github.com/officemymobile-tech/hno-alici-web/settings/pages
2. **Source:** „GitHub Actions“ wählen (nicht „Deploy from branch“)
3. Nach jedem Push auf `main` läuft der Workflow `.github/workflows/deploy.yml` automatisch

**Live-URLs nach Deploy:**
- https://officemymobile-tech.github.io/hno-alici-web/ (GitHub-Standard)
- https://hno-alici.at (nach Ionos-DNS, siehe unten)

## 2. Ionos DNS umstellen

Im Ionos-Kundenbereich → Domain `hno-alici.at` → **DNS-Einstellungen**

### Alte WordPress-Einträge entfernen
Alle A/CNAME-Einträge löschen, die auf den alten WordPress-Host zeigen.

### Neue Einträge setzen

| Typ | Host / Name | Wert | TTL |
|-----|-------------|------|-----|
| **A** | `@` | `185.199.108.153` | 3600 |
| **A** | `@` | `185.199.109.153` | 3600 |
| **A** | `@` | `185.199.110.153` | 3600 |
| **A** | `@` | `185.199.111.153` | 3600 |
| **CNAME** | `www` | `officemymobile-tech.github.io` | 3600 |

> Bei Ionos heißt das Root-Feld oft **@** oder bleibt leer für die Hauptdomain.

### HTTPS
GitHub stellt automatisch ein Let's-Encrypt-Zertifikat aus, sobald DNS propagiert ist (meist 15 Min – 48 Std.).

Unter GitHub → Settings → Pages → **Custom domain:** `hno-alici.at` eintragen und „Enforce HTTPS“ aktivieren.

## 3. WordPress abschalten

Nach erfolgreichem Test von https://hno-alici.at:
- WordPress-Hosting bei Ionos deaktivieren oder Domain-Verknüpfung entfernen
- Alte Site nicht parallel laufen lassen (SEO-Duplikate vermeiden)

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
