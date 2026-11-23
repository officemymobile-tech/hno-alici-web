# Sanity Content Migration Plan — fehlende Arztprofile, Bewertungen, SEO-Landingpages

**Status: Plan erstellt, noch NICHT ausgeführt.** Wartet auf deine gesonderte Freigabe, bevor irgendetwas in die production-Datenbank (`qhrodl8k`) geschrieben wird. Diese Datei beschreibt exakt, was passieren würde.

## 1. Bestandsaufnahme (read-only geprüft, 2026-11-23)

```
npx sanity documents query '*[_type in ["doctor","reviewPlatform","patientReview","landingPage"]]{_id,_type}' --project qhrodl8k --dataset production
```

Ergebnis: **nur `doctor.dr-uemit-alici` existiert.** Keine `reviewPlatform`-, `patientReview`- oder `landingPage`-Dokumente vorhanden — keine Kollisionsgefahr mit den unten geplanten IDs.

## 2. Was migriert werden soll — und woher es kommt

| Neuer Dokumenttyp | Anzahl | Quelle (bereits echt, bereits live) | Erfunden? |
|---|---|---|---|
| `doctor` | 2 (Dr. Sigrid Meier, Dr. Benjamin Alici) | `src/content/site-content.ts`'s `doctors`-Array — exakt derselbe Name/Titel, der heute schon auf der Live-Website steht | **Nein** |
| `reviewPlatform` | 3 (Google, DocFinder, Herold) | `src/content/reviews.ts`'s `reviewPlatforms` — dieselben Bewertungszahlen, die heute schon auf der Live-Website und in den strukturierten Daten stehen | **Nein** |
| `patientReview` | 6 | `src/content/reviews.ts`'s `patientReviews` — wortgleiche, bereits veröffentlichte Patientenstimmen | **Nein** |
| `landingPage` | 2 (bilingual, deckt alle 4 URLs ab) | `src/content/seo-landings.ts`'s `seoLandings` — Titel/H1/Meta-Beschreibung/Keywords/Hero-Text/Vorteile exakt wie heute live | **Nein** |

Keine neuen Namen, Qualifikationen, Bewertungen oder medizinischen Angaben — jedes Feld ist eine 1:1-Kopie von Text, der bereits auf `hno-alici.at` sichtbar ist. Die genauen JSON-Dateien liegen unter `docs/sanity/migration/01-doctors.json` bis `04-landing-pages.json` — bitte vor Freigabe selbst gegenprüfen.

## 3. Bewusste Lücken in dieser Migration (keine Erfindung)

- **Dr. Sigrid Meiers Portraitfoto** wird in diesem Schritt NICHT als Sanity-Bild-Asset hochgeladen — ihr reales Foto liegt aktuell nur als lokale Datei (`/images/pro/dr-meier-pro.jpg`, verknüpft über `siteSettings.editableImages.drMeierPortrait`) vor. Das Frontend zeigt ihr Foto trotzdem korrekt weiter an (der bereits implementierte Fallback-Mechanismus in `src/content/doctors-list.ts` greift automatisch, wenn `doctor.portrait` leer ist). Ein echtes Hochladen des Fotos als eigenständiges Sanity-Asset wäre ein separater, zusätzlicher Schritt (Bild hochladen + `doctor.portrait`-Feld im Studio setzen) — kann bei Bedarf nachgeliefert werden.
- **Dr. Benjamin Alici bekommt bewusst kein Foto** — es existiert kein verifiziertes echtes Foto von ihm (bereits in einer früheren Sitzungsrunde so festgestellt und seitdem korrekt als Initialen-Avatar dargestellt). Das bleibt so.
- **Die `landingPage`-Dokumente setzen keine eigene URL/Slug-Logik** — das Feld `slugKey` dient nur der Zuordnung zum bereits bestehenden, unveränderten Routing. Die tatsächlichen URLs (`/tuerkischer-hno-arzt-wien` usw.) bleiben exakt wie heute.

## 4. Wie die Migration ausgeführt würde (idempotent)

```
cd docs/sanity/migration
./run-migration.sh production
```

Jedes Dokument hat eine feste, deterministische ID (z. B. `doctor.dr-sigrid-meier`, `reviewPlatform.google`, `patientReview.1`, `landingPage.turkishHno`) — demselben Namensschema wie die bereits migrierten Dokumente (`doctor.dr-uemit-alici`, `staffMember.frau-ruzica-tadic`, …). Der CLI-Flag `--missing` sorgt dafür, dass **ausschließlich neue, noch nicht existierende IDs angelegt werden** — ein bereits vorhandenes Dokument wird nie verändert oder überschrieben. Ein zweiter, versehentlicher Durchlauf des Skripts wäre also folgenlos (es würde einfach nichts mehr tun, da alle IDs schon existieren).

**Zum Testen vor der echten Migration** kann dasselbe Skript gegen ein isoliertes `test`-Dataset laufen (`./run-migration.sh test`, nachdem `npx sanity dataset create test --visibility private` ausgeführt wurde) — exakt das Muster, das in früheren Sitzungsrunden bereits für sichere Tests verwendet wurde.

## 5. Was NICHT ausgeführt wurde

- Kein einziger `npx sanity documents create ...`-Befehl wurde in dieser Runde tatsächlich gegen `production` ausgeführt.
- Keine Assets hochgeladen.
- Keine bestehenden Dokumente gelesen-und-verändert — nur die bereits oben gezeigte, rein lesende Bestandsprüfung.

## 6. Nötige Freigabe

Bitte bestätige ausdrücklich, dass ich `./run-migration.sh production` ausführen soll (oder weise mich an, zuerst gegen `test` zu probieren). Erst nach dieser Freigabe werde ich die Schreiboperation durchführen — und melde dir danach das tatsächliche Ergebnis (nicht nur „sollte funktioniert haben").
