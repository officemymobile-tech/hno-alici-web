# SEO Root-Redirect & `/svg`-Befund — Diagnose & Fix

**Datum:** 2026-11-23. **Umfang:** ausschließlich der Root-Redirect-Stub (`/`). Keine Änderungen an DNS, Proxy-Status oder Hosting-Architektur — diese Entscheidung erfordert eine separate Freigabe (siehe Abschnitt „Was offen bleibt").

## Phase 1 — Echte HTTP-Diagnose (vorher)

| URL | Status | Befund |
|---|---|---|
| `https://hno-alici.at/` | **200 OK** (nicht 301/308!) | 366 Byte HTML mit `<meta http-equiv="refresh" content="0; url=/de/">` + `location.replace("/de/")`. Canonical war bereits korrekt auf `/de/`, **aber kein `robots`-Meta-Tag** — das ist die tatsächliche Ursache des niedrigen Seobility-Scores: ein Crawler, der den Meta-Refresh nicht ausführt, bewertet diese fast inhaltsleere Seite als eigenständigen Inhalt. |
| `https://hno-alici.at/de/` | 200 | Vollständige, echte deutsche Startseite (145 KB). |
| `https://hno-alici.at/tr/` | 200 | Vollständige, echte türkische Startseite (142 KB). |
| `https://hno-alici.at/svg` | **404** | Kein Redirect, kein Inhalt — siehe Abschnitt „/svg". |
| `https://hno-alici.at/index.html` | 200, identisch mit `/` | Bestätigt: GitHub Pages serviert `/` direkt als `index.html`, kein Server-Routing. |
| `/admin/` | 404 | Korrekt — altes Admin-Panel bleibt entfernt. |
| `/sitemap.xml`, `/robots.txt` | 200, korrekt | Unverändert. |

**Entscheidende, bisher falsch angenommene Tatsache (DNS-Check):** `hno-alici.at` nutzt **nicht Cloudflare**. Nameserver sind `ns*.ui-dns.{de,org,biz,com}` (United Internet/IONOS), A-Records zeigen direkt auf die 4 GitHub-Pages-IPs (`185.199.108-111.153`), `www.` ist ein CNAME auf `officemymobile-tech.github.io`. Response-Header bestätigen GitHub Pages' eigenes CDN (`Server: GitHub.com`, Fastly/Varnish) — **keine** Cloudflare-Proxy-Header. Cloudflare wird in diesem Projekt ausschließlich für die unabhängigen `*.workers.dev`-Subdomains des Sanity-Webhook-Workers genutzt, nicht für `hno-alici.at` selbst.

## `/svg` — Untersuchungsergebnis

Vollständige Suche im Quellcode, im gebauten `out/`-Verzeichnis, in `sitemap.xml` und `robots.txt`: **keine einzige echte Verlinkung auf `/svg`** gefunden (nur Falsch-Treffer durch `xmlns="...2000/svg"`-Namespace-Deklarationen in Inline-SVGs, die den Substring „/svg" zufällig enthalten). Live-Abfrage liefert einen sauberen, echten `404` ohne Redirect oder Inhalt. **Es gibt aktuell keinen funktionalen `/svg`-Fehler auf der Website.** Der Seobility-Befund spiegelt höchstwahrscheinlich einen älteren/zwischengespeicherten Crawl wider (z. B. von vor dieser Migration) oder eine externe Quelle außerhalb dieses Repos. Keine erfundene Erklärung — das ist der ehrliche Befund nach gründlicher Prüfung.

## Phase 2 — Was tatsächlich behoben wurde

**Nicht behebbar ohne separate Freigabe:** Ein echter HTTP 301/308 an der Root-URL ist auf GitHub Pages technisch unmöglich — es gibt dort keine Server-Laufzeit, nur statische Dateien. Das würde einen Reverse-Proxy (z. B. Cloudflare, DNS-Umstellung von IONOS) erfordern — genau die Art von Infrastrukturänderung, die laut Auftrag vorab eine gesonderte Freigabe braucht.

**Tatsächlich behoben (risikoarm, innerhalb des bestehenden Setups):** Eine eigene `src/app/page.tsx` ersetzt jetzt Next.js' automatisch generierten Root-Stub (der durch next-intls `localePrefix: "always"` ohne eigene Root-Seite entsteht) durch eine explizite, vollständige HTML-Seite mit:
- `<meta http-equiv="refresh" content="0; url=/de/">` (funktioniert auch ohne JavaScript)
- **`<meta name="robots" content="noindex, nofollow">`** — fehlte komplett vorher, ist der eigentliche Fix
- `<link rel="canonical" href="https://hno-alici.at/de/">`
- `<script>location.replace("/de/")</script>` für sofortigen Redirect mit JS
- `<p><a href="/de/">Zur Startseite</a></p>` als sichtbarer Fallback-Link

Ein Zwischenschritt mit `next/navigation`s `redirect()` wurde verworfen: unter `output: "export"` erzeugt das eine rein React-Hydration-abhängige Weiterleitung **ohne** Meta-Refresh-Fallback — schlechter für genau die nicht-JS-ausführenden Crawler, die das eigentliche Problem sind.

## Phase 3 — SEO-Validierung (nachher, live geprüft)

| Prüfung | `/` | `/de/` | `/tr/` |
|---|---|---|---|
| Status | 200 (unverändert, siehe oben) | 200 | 200 |
| robots | **noindex, nofollow** (neu) | kein noindex (korrekt indexierbar) | kein noindex (korrekt indexierbar) |
| Canonical | `https://hno-alici.at/de/` | `https://hno-alici.at/de/` | unverändert korrekt |
| Title/H1/Meta Description | n/a (Redirect-Stub) | unverändert, real | unverändert, real |
| Hreflang | n/a | unverändert korrekt (de-AT/tr-AT/x-default) | unverändert korrekt |
| Structured Data | n/a | unverändert, echte Öffnungszeiten | unverändert |

## Phase 4 — Sanity-Kompatibilität

`src/app/page.tsx` hat keine Abhängigkeit zu Sanity, `CONTENT_SOURCE` oder irgendeinem Content-Loader — reine statische Markup-Seite. Keine Content-Migration nötig oder durchgeführt. Alle 43 Sanity-Dokumente, der Webhook, der Worker, GitHub Actions und der Fail-Closed-Build bleiben exakt wie zuvor.

## Phase 5 — Deployment & echter Retest

| | Vorher | Nachher |
|---|---|---|
| HTTP-Status `/` | 200 | 200 (unverändert — siehe „Was offen bleibt") |
| `robots`-Meta auf `/` | **fehlte** | **`noindex, nofollow`** |
| `/de/`, `/tr/` | 200, korrekt | 200, korrekt, unverändert |
| `/svg` | 404 | 404, unverändert |

- `npx tsc --noEmit`: sauber.
- `npm run build`: erfolgreich.
- Playwright, voller Lauf: **154/154 bestanden**.
- Deployment: Commit `5166b43`, GitHub-Actions-Run erfolgreich (build + deploy), live auf https://hno-alici.at/ verifiziert (curl gegen die echte Produktions-URL, nicht nur den Actions-Log).

## Was offen bleibt (braucht deine separate Freigabe)

Ein **echter** HTTP 301/308 auf `https://hno-alici.at/` → `/de/` ist nur möglich, wenn ein Reverse-Proxy vor GitHub Pages gesetzt wird — am gängigsten: `hno-alici.at`s DNS auf Cloudflare umstellen (von den aktuellen IONOS-Nameservern) und dort eine Redirect Rule konfigurieren. Das ist genau die Art von DNS-/Proxy-/Hosting-Architekturänderung, die laut Auftrag **vorab eine gesonderte Freigabe** braucht — ich habe sie nicht vorgenommen. Mit dem jetzt umgesetzten `noindex`-Fix sollte das ursprüngliche Seobility-Symptom (Root-Seite als eigenständiger, inhaltsarmer Treffer) bei einem erneuten Crawl verschwinden; ein echter 301 wäre zusätzlich „technisch sauberer", ist aber kein Muss, um das konkret gemeldete Problem zu lösen.

Keine erfundenen Seobility-Punktzahlen in diesem Bericht — eine neue Bewertung erfordert einen frischen Crawl durch Seobility selbst, den ich nicht auslösen kann.
