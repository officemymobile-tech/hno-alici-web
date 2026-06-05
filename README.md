# hno-alici.at – Premium Praxis-Website

Next.js-Website für **Dr. Ümit Alici**, Facharzt für HNO in Wien Favoriten (1100).

## Features

- **Next.js 16** mit App Router und Tailwind CSS
- **Mehrsprachigkeit** Deutsch + Türkisch (`next-intl`)
- **SEO** – Metadata, Schema.org (Physician), Sitemap, hreflang
- **Mobile First** – responsive Premium-Design
- **DSGVO** – Datenschutz- und Impressumsseiten
- **Fokus Dr. Ümit Alici** – Marke, Akutversorgung, Kinder-HNO, türkischsprachige Betreuung

## Sitemap

- Startseite
- Dr. Ümit Alici (Lebenslauf, Qualifikationen, Philosophie)
- Leistungen (7 Fachbereiche)
- Patienteninfo (Kassen, FAQ, Akuttermine)
- Bewertungen, Kontakt, Online Termin
- Impressum, Datenschutz

## Entwicklung

```bash
cd hno-alici-web
npm install
npm run dev
```

Öffnen: [http://localhost:3000/de](http://localhost:3000/de) oder `/tr`

## Build & Deployment

```bash
npm run build
npm start
```

Empfohlen: **Vercel** mit Domain `hno-alici.at`.

## CMS (nächster Schritt)

Inhalte liegen in `messages/de.json` und `messages/tr.json`. Für redaktionelle Pflege:

- **Sanity CMS** oder **Strapi** anbinden
- JSON-Struktur als Schema-Vorlage nutzen

## Migrierte Inhalte von hno-alici.at

Alle Seiten und Bilder der alten WordPress-Website wurden übernommen:

- **Ordination** (Startseite): Ärzte, Leistungen, Öffnungszeiten, Kassen
- **Team**: Dr. Ümit Alici, Dr. Sigrid Meier, Dr. Benjamin Alici + 9 Ordinationsteam-Mitglieder
- **Leistungen**: Allgemeine HNO, Kinder-HNO, Allergie (vollständige Texte + Fotos)
- **Kontakt**: Telefon, Adresse, E-Mail, Facebook, Kartenbild
- **Impressum & Datenschutz**: Originaltexte 1:1

Bilder in `public/images/` (15 Dateien von hno-alici.at).

## Noch optional

- Live-Öffnungsstatus (war dynamisch auf alter Site)
- Echte Patientenbewertungen
- Online-Terminbuchungs-Integration (z. B. Doctolib)

## Kontaktdaten (von hno-alici.at)

- Tel: +43 1 6025400
- E-Mail: ordination@hno-alici.at
- Adresse: Senefeldergasse 3/1, 1100 Wien
