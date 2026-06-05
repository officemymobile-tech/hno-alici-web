# Compliance-Dokumentation – HNO Alici Website

Interne Dokumentation für die DSGVO-/TKG-Compliance der Website **hno-alici.at**.  
Stand: Juni 2026

## Checkliste vor Veröffentlichung

| # | Prüfpunkt | Status | Nachweis |
|---|-----------|--------|----------|
| 1 | Datenschutzerklärung vollständig & aktuell | ✅ | `/de/datenschutz`, `/tr/datenschutz` |
| 2 | Impressum nach ECG/Ärztegesetz | ✅ | `/de/impressum` – Kammer, Berufsrecht |
| 3 | Cookie-Richtlinie vorhanden | ✅ | `/de/cookie-richtlinie` |
| 4 | Cookie-Banner bei Drittinhalten | ✅ | `CookieConsent.tsx` |
| 5 | Google Maps nur mit Consent | ✅ | `GoogleMapEmbed.tsx` |
| 6 | Kein Analytics ohne Consent | ✅ | Kein Tracking eingebunden |
| 7 | Formular: Einwilligung + Datenschutzlink | ✅ | `AppointmentForm.tsx` |
| 8 | Keine Gesundheitsdaten im Formular | ✅ | Hinweis + Privacy-Text |
| 9 | AVV mit Vercel | ⚠️ | [avv-vercel.md](./avv-vercel.md) – DPA abschließen |
| 10 | AVV E-Mail-Provider | ⚠️ | [avv-email.md](./avv-email.md) – Provider prüfen |
| 11 | Verarbeitungsverzeichnis (Art. 30) | ⚠️ | [verarbeitungsverzeichnis.md](./verarbeitungsverzeichnis.md) |
| 12 | HTTPS erzwungen | ✅ | Vercel + HSTS Header |
| 13 | Security Headers (HSTS, CSP) | ✅ | `vercel.json` |
| 14 | Fonts self-hosted (next/font) | ✅ | `layout.tsx` |
| 15 | Keine Marketing-Pixel | ✅ | Keine Pixel/GA eingebunden |
| 16 | Betroffenenrechte-Prozess | ⚠️ | [betroffenenrechte.md](./betroffenenrechte.md) |
| 17 | Türkische Datenschutzseite | ✅ | `/tr/datenschutz` |
| 18 | Haftungsausschluss Medizin | ✅ | `/de/haftungsausschluss` |
| 19 | Notfallhinweis (144) | ✅ | Footer + Termin-Formular |
| 20 | DSFA bei Termin-Drittanbieter | ⚠️ | [dsfa-hinweis.md](./dsfa-hinweis.md) |
| 21 | Backup & Zugriffskontrolle | ⚠️ | [backup-zugriff.md](./backup-zugriff.md) |
| 22 | KI-Bilder: Transparenz/Ethik | ✅ | Privacy §8 + [ki-bilder.md](./ki-bilder.md) |

## Offene organisatorische Aufgaben

1. **Vercel DPA** im Vercel-Dashboard unter Settings → Legal aktivieren und dokumentieren.
2. **E-Mail-Provider** (Mailbox ordination@ / datenschutz@) identifizieren und AVV prüfen.
3. **Verarbeitungsverzeichnis** in der Ordination ausdrucken/archivieren und jährlich prüfen.
4. **Betroffenenrechte**: E-Mail-Postfach `datenschutz@hno-alici.at` einrichten und Prozess schulen.

## Technische Komponenten

- Consent: `src/lib/consent.ts`, `src/components/consent/`
- Rechtstexte: `src/content/legal/`
- Security: `vercel.json` Headers
