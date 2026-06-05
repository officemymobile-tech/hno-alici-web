# Deployment hno-alici.at

## Vercel (empfohlen)

```bash
cd hno-alici-web
npx vercel login
npx vercel link
npx vercel --prod
```

### Domain verbinden

1. Vercel Dashboard → Project → Settings → Domains
2. `hno-alici.at` und `www.hno-alici.at` hinzufügen
3. DNS bei Helloly/Registrar:

| Typ | Name | Wert |
|-----|------|------|
| A | @ | 76.76.21.21 (Vercel) |
| CNAME | www | cname.vercel-dns.com |

4. Alte WordPress-Site abschalten nach erfolgreichem Test

## Lokal testen

```bash
npm run build
npm start
# http://localhost:3000/de
```

## SEO Report

```bash
node scripts/seo-report.mjs
```

## GitHub Actions

Secrets setzen: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
