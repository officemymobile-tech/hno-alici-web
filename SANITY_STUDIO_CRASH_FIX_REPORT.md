# Sanity Studio — Absturz nach Login: Root Cause & Fix

**Datum:** 2026-11-23. **Betroffene URL:** `https://hno-alici-web.sanity.studio/`. **production-Daten, GitHub Pages, DNS und das alte Admin-System wurden zu keinem Zeitpunkt verändert.**

## 1. Root Cause — nachgewiesen, kein Verdacht

**Fehlermeldung (per Playwright reproduziert, voller Stacktrace):**
```
Error: Configuration must contain `projectId`
    at Qe (authStore-BW6CPIWb-EAJN7yHI.js:2:7232)
    at e.config (authStore-BW6CPIWb-EAJN7yHI.js:7:13632)
    at new e (authStore-BW6CPIWb-EAJN7yHI.js:7:12844)
    at createClient (authStore-BW6CPIWb-EAJN7yHI.js:7:15560)
    at clientFactory (useCreatableVariantInitialValue-CDVvAXW1-ByT69gul.js:205:1595)
    ...
```
Sichtbar als Sanitys generische Absturzseite: „An error occurred that Sanity Studio was unable to recover from."

**Ursache:** `sanity/env.ts` las `projectId`/`dataset`/`apiVersion` ausschließlich über `process.env.NEXT_PUBLIC_SANITY_*` — eine reine **Next.js**-Build-Konvention (von Next.js' eigenem Compiler zur Build-Zeit direkt durch den Literalwert ersetzt). Der eigenständige Studio-Build (`sanity build`/`sanity deploy`, Vite-basiert über `@sanity/cli`) kennt dieses Präfix nicht. Vite ersetzt `process.env` für jeden nicht erkannten Schlüssel durch ein leeres Objekt `{}`. Dadurch wurde `projectId` beim Bau des gehosteten Studios zu `""` — bestätigt per direktem Grep im bereits deployten Bundle:
```
XT_PUBLIC_SANITY_PROJECT_ID||``;
```
Der Login-Bildschirm selbst läuft generisch über sanity.io und war davon nicht betroffen — deshalb der Eindruck „Absturz nach dem Login": Sobald die App nach der Anmeldung versucht, ihren eigenen Sanity-Client mit der leeren `projectId` zu initialisieren, stürzt sie in `authStore`/`createClient` ab.

## 2. Fix

**`sanity/env.ts`:** Fallback auf `SANITY_STUDIO_*`-Variablen ergänzt — das Präfix, das `@sanity/cli`s Vite-Konfiguration tatsächlich zur Build-Zeit einbettet (im Build-Log explizit bestätigt: „Including the following environment variables as part of the JavaScript bundle: SANITY_STUDIO_API_VERSION, SANITY_STUDIO_DATASET, SANITY_STUDIO_PROJECT_ID"). Next.js-Pfad bleibt unverändert, da sein Compiler den ersten Ausdruck (`NEXT_PUBLIC_*`) ohnehin direkt ersetzt, bevor der Fallback je erreicht wird.

```ts
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || "2025-01-01";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";
```

**`.env.local`:** drei neue Zeilen (`SANITY_STUDIO_PROJECT_ID=qhrodl8k`, `SANITY_STUDIO_DATASET=production`, `SANITY_STUDIO_API_VERSION=2025-01-01`) als 1:1-Spiegel der bestehenden `NEXT_PUBLIC_*`-Werte.

**`sanity.cli.ts`:** zusätzlich `deployment: { appId: "iceio5thj7ttebmeqb20hb1a" }` ergänzt (von Sanity selbst nach dem ersten Deploy empfohlen, verhindert eine interaktive Nachfrage bei künftigen Deploys — keine funktionale Änderung).

Kein Paket-Upgrade, keine Schema-Änderung, keine Struktur-/Menü-Änderung, `vite: publicDir: false` (aus dem vorherigen Fix) unverändert erhalten.

## 3. Verifikation vor dem Deployment

| Prüfung | Ergebnis |
|---|---|
| `qhrodl8k` korrekt im eigenständigen Build eingebettet | ✅ `grep` im neuen Bundle: `` NEXT_PUBLIC_SANITY_PROJECT_ID||`qhrodl8k` `` |
| Keine Secrets im öffentlichen Bundle | ✅ `SANITY_API_TOKEN` taucht nur als (a) unaufgelöster `({}).SANITY_API_TOKEN`-Ausdruck (gleicher sicherer `{}`-Mechanismus, kein echter Wert) und (b) als Beispieltext im Vision-Plugin („curl -H \"Authorization: Bearer $SANITY_API_TOKEN\""`) auf — kein echter Tokenwert, `.env.local` hat ohnehin aktuell keinen gesetzt |
| `publicDir: false` weiterhin wirksam | ✅ Build-Ausgabe: nur `favicon.ico`, `index.html`, `static/` — kein `admin/`, kein `CNAME`, keine Website-Bilder |
| `npx tsc --noEmit` | ✅ sauber |
| `npm run build` (Next.js) | ✅ sauber, `/studio`-Route unverändert erzeugt |
| Playwright `studio-deep-link.spec.ts` | ✅ 8/8 (zweifach wiederholt zur Bestätigung) |
| **Reproduktion des alten Fehlers** (historischer Build, lokal via Playwright serviert) | ✅ exakt derselbe Stacktrace wie oben reproduziert |
| **Verifikation des Fixes** (neuer Build, lokal via Playwright serviert) | ✅ kein Crash-Boundary-Text, kein `projectId`-Konsolenfehler mehr |

## 4. Deployment

```
npx sanity deploy studio-fix-build --no-build --url hno-alici-web --yes
→ Success! Studio deployed to https://hno-alici-web.sanity.studio/
```

Ausschließlich die gehostete Studio-Instanz wurde aktualisiert. Website, GitHub Pages, DNS, production-Inhalte, altes Admin-System: unverändert.

## 5. Verifikation der neuen öffentlichen Version

- Die URL ist weiterhin öffentlich erreichbar (HTTP 302 → Sanity-Login-Flow → HTTP 200), unverändert zum vorherigen Check.
- **Direkt bewiesen, nicht nur angenommen:** Die exakte, jetzt live deployte JS-Datei wurde direkt von `https://hno-alici-web.sanity.studio/static/sanity-CBPm_n6C.js` abgerufen und enthält nachweislich `` NEXT_PUBLIC_SANITY_PROJECT_ID||`qhrodl8k` `` — die reale Projekt-ID ist in der live ausgelieferten Datei vorhanden, nicht nur in meinem lokalen Build.
- Dasselbe Bundle wurde lokal bereits ohne den Absturz getestet (Abschnitt 3).

### BLOCKED — manueller Test erforderlich

Eine vollständige authentifizierte Prüfung (echter Login-Klickpfad → Dashboard → die 8 angefragten Bereiche: Website-Einstellungen, Editierbare Bilder, Dr.-Alici-Porträt, Leistungen, Ärzte/Team, Öffnungszeiten, SEO-Felder) ist mir technisch nicht möglich — ich habe keinen Zugriff auf eine echte, angemeldete Browsersitzung und frage keine Zugangsdaten ab. Die statischen Assets sind ohne Login direkt abrufbar, aber der Root-Pfad leitet jede nicht angemeldete Anfrage zu Sanitys eigenem Login weiter, sodass ich die React-App nach dem Login nicht selbst ausführen kann.

**Bitte öffne `https://hno-alici-web.sanity.studio/` selbst, melde dich mit deinem Sanity-Konto an und bestätige, dass die 8 genannten Bereiche jetzt ohne den „An error occurred"-Absturz laden.**

## 6. Aufräumen

Entfernt (reine, reproduzierbare Build-/Diagnoseartefakte, keine Beweise — der volle Fehler-Stacktrace und alle Grep-Befunde sind oben wortgetreu dokumentiert):
- `studio-broken-repro/` (temporärer Nachbau des historischen fehlerhaften Builds zur Reproduktion)
- `studio-fix-build/` (bereits deployter, lokal verifizierter Build)
- `tests/studio-crash-repro.spec.ts` (Diagnose-Testdatei, nie Teil der regulären Suite)

Unverändert erhalten: die bereits vorher bestehende, unabhängige `dist/`-Altlast (nicht Teil dieser Arbeit, zu keinem Zeitpunkt berührt), alle 62 redaktionellen Content-Felder, alle Schemas, die deutschen Studio-Menüs, das Design, der `publicDir: false`-Schutz.
