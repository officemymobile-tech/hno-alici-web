# Sanity Free Plan — Kompatibilitätsprüfung

**Datum:** 2026-11-23. **Projekt:** `qhrodl8k`. **Quelle:** offizielle Sanity-Dokumentation, gelesen 2026-11-23 — `sanity.io/pricing`, `sanity.io/docs/platform-management/plans-and-payments`, `sanity.io/docs/content-lake/technical-limits`, `sanity.io/docs/platform-management/growth-plan-trial`. Kein kostenpflichtiges Upgrade durchgeführt, keine Zahlungsdaten hinterlegt.

## 1. Zentrale Erkenntnis: private Datasets sind auf dem Free Plan nicht verfügbar

> „2 datasets (public only)" (Pricing-Tabelle) · Vergleichstabelle: „Private datasets" = **„Not included—"** auf Free, **„Included"** ab Growth · Beim Downgrade: „Private datasets are switched to public."

**Das ist keine Entscheidung, die wir treffen — es ist eine feste Plan-Grenze.** Unser `production`-Dataset ist **bereits jetzt** auf `public` gesetzt (direkt per CLI geprüft: `sanity dataset visibility get production` → `public`) — das war schon vor dieser Prüfung so, nicht erst durch einen Wechsel.

### Prüfung: werden dadurch sensible/personenbezogene Daten offengelegt?

Tatsächlichen Inhalt aller 6 `patientReview`-Dokumente direkt geprüft: `author`-Feld enthält ausschließlich anonymisierte Platzhalter (`"DocFinder Patient"`, `"International Patient"`, `"Herold Patient"`) — **keine echten Namen, keine Patientendaten.** Diese Bewertungen sind ohnehin Abschriften bereits öffentlicher Bewertungen von DocFinder/Herold/Google (siehe `reviewPlatform`-Dokumente). Die übrigen Dokumenttypen (`doctor`, `staffMember`, `service`, `openingHours`, `closurePeriod`, `announcement`, `blogPost`, `legalDocument`, `siteSettings`, `landingPage`) enthalten ausschließlich Inhalte, die ohnehin öffentlich auf der Website angezeigt werden (Namen von Ärzten/Mitarbeitern, Öffnungszeiten, Leistungsbeschreibungen, SEO-Texte, Rechtsdokumente). **Es befinden sich keine geheimen, nicht-öffentlichen oder echten Patientendaten in Sanity.** Kein Handlungsbedarf — aber ab jetzt verbindlich: **niemals** echte Patientendaten, Terminanfragen, Kontaktformular-Einsendungen oder sonstige nicht-öffentliche Inhalte in Sanity ablegen, solange der Free Plan genutzt wird.

## 2. Weitere Free-Plan-Grenzen — geprüft gegen unseren tatsächlichen Stand

| Grenze (Free) | Unser Stand | Kompatibel? |
|---|---|---|
| 2 Datasets | 1 (`production`) genutzt | ✅ |
| 20 Nutzer-Sitze | 1 Mitglied | ✅ |
| Nur Rollen **Administrator** und **Viewer** — **kein separates „Editor"** (bestätigt deine Vermutung) | 1 Administrator | ✅ für jetzt — bei künftigen weiteren Redakteuren: jeder zusätzliche Schreibzugriff läuft nur über die volle Administrator-Rolle, da Free keine eingeschränkte Editor-Rolle kennt |
| 10.000 Dokumente gesamt | 43 (30 Alt + 13 migriert) | ✅ weit darunter |
| 2.000 einzigartige Attribute/Dataset, 1.000/Dokument | unsere Schemas liegen deutlich darunter | ✅ |
| 2 GROQ-Webhooks | wir brauchen 1 (Sanity→Worker) | ✅ |
| 1 Mio. API-CDN-Anfragen/Monat, 250.000 API-Anfragen/Monat | Build-Trigger nur bei Publish, moderate Lesezugriffe; Studio-eigene API-Aufrufe zählen laut Sanity seit der neuen Preisstruktur nicht mehr gegen das Kontingent | ✅ weit darunter |
| 100 GB Assets, 100 GB Bandbreite/Monat | aktuell nur wenige MB an Bildern | ✅ |
| Gehostetes Studio (`*.sanity.studio`) | „Free hosting: Included" in der offiziellen Tabelle | ✅ bereits genutzt (`hno-alici-web.sanity.studio`) |

## 3. Was bei Erreichen eines Limits passiert (keine Überraschung, bereits architektonisch abgefangen)

Laut offizieller Doku: feste Obergrenzen auf Free, **keine Überbuchung möglich**. Bei 100 % Auslastung von API/CDN/Bandbreite: „Public API access is blocked", Anfragen liefern HTTP 402 (`plan_limit_reached`) — **das Studio selbst bleibt dabei weiterhin benutzbar.** Bei Erreichen des Dokumentlimits: keine neuen Dokumente/Entwürfe mehr anlegbar, bestehende Inhalte bleiben unverändert erreichbar.

**Bereits heute real getestet, nicht nur theoretisch:** `CONTENT_SOURCE=sanity npm run build` mit einem ungültigen/nicht funktionierenden Token lief erfolgreich durch — jeder Content-Loader fängt einen fehlschlagenden Sanity-Zugriff ab und fällt automatisch auf die lokalen Daten zurück. Ein Erreichen des Free-Plan-Limits würde die Website also **nicht** zum Absturz bringen, sondern den nächsten Build auf den letzten bekannten lokalen Stand zurückfallen lassen (siehe Empfehlung zu Logging in `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md`).

## 4. Growth-Trial-Ende — was konkret passiert

Jedes neue Projekt erhält automatisch einen Growth-Trial, der aber bereits mit den Free-Nutzungsgrenzen läuft (20 Nutzer, 2 Datasets, 10.000 Dokumente, 2 Webhooks — identisch zu Free). Am Ende: „automatically downgraded to the Free plan" — **ohne Zahlungsaufforderung, ohne Belastung**, sofern nicht aktiv auf Growth upgegradet wird. Beim automatischen Downgrade: private Datasets würden öffentlich (**bei uns bereits der Fall, keine Änderung**), Nicht-Admin-Mitglieder würden zu Viewer (**wir haben aktuell nur 1 Administrator, kein Effekt**). Kein Hinweis in der offiziellen Doku, dass dabei Inhalte gelöscht oder ein Dataset gesperrt würde. Exakte Trial-Restlaufzeit ist nur im Sanity-Dashboard selbst sichtbar (nicht per CLI auslesbar) — empfehlenswert, das Datum dort einmal zu prüfen.

## 5. Fazit

**Vollständig kompatibel mit dem Free Plan**, ohne irgendeine kostenpflichtige Funktion als notwendigen Bestandteil. Die bestehenden Schemas, der eine geplante Webhook und die automatische Veröffentlichung passen alle innerhalb der Free-Grenzen, mit großem Puffer. Die einzige echte Plan-Grenze mit Auswirkung (kein privates Dataset, keine Editor-Rolle) betrifft unsere aktuellen Inhalte nicht negativ, da nichts Sensibles in Sanity liegt und aktuell nur ein Administrator-Konto existiert.
