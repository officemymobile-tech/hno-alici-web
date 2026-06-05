# Deployment hno-alici.at (GitHub Pages)

## Voraussetzungen

- Repository: https://github.com/officemymobile-tech/hno-alici-web
- DNS bei Ionos
- Kein Vercel nötig

## GitHub Pages aktivieren

1. GitHub → Repository → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Nach Push auf `main` läuft `.github/workflows/deploy.yml` automatisch
4. Unter **Custom domain** eintragen: `hno-alici.at`
5. **Enforce HTTPS** aktivieren (nach DNS-Propagierung)

## Ionos DNS

| Typ | Host/Name | Wert | TTL |
|-----|-----------|------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |
| CNAME | www | officemymobile-tech.github.io | 3600 |

Optional: `www.hno-alici.at` als zweite Custom Domain in GitHub Pages hinzufügen.

## Lokal testen

```bash
npm run build
npx serve out
# http://localhost:3000/de/
```

## Technik

- Next.js `output: 'export'` → statisches `out/`-Verzeichnis
- Root `/` leitet per `public/index.html` nach `/de/` weiter
- Middleware entfällt (nicht kompatibel mit Static Export)
- `vercel.json` wird nicht verwendet (Redirects/Headers nur auf Vercel)
