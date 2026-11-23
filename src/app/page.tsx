import { routing } from "@/i18n/routing";

// next-intl's `localePrefix: "always"` has no real server/middleware under
// `output: "export"` (no server at request time at all — GitHub Pages only
// serves static files), so a true HTTP 301/308 at this exact path is not
// possible without a reverse proxy in front of GitHub Pages (out of scope
// here — see SEO_ROOT_REDIRECT_FIX_REPORT.md). This renders the full HTML
// document directly (the root layout is a pure passthrough, so nothing else
// supplies <html>/<head>) rather than using next/navigation's `redirect()`,
// which under static export emits a React/RSC-hydration-only redirect with
// no meta-refresh fallback — worse for exactly the non-JS crawlers this
// page exists to serve correctly. `noindex` + canonical ensure this stub is
// never treated as real content even by a crawler that does index it.
const target = `/${routing.defaultLocale}/`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://hno-alici.at${target}`} />
        <title>Weiterleitung …</title>
        <script
          // eslint-disable-next-line react/no-danger -- static redirect script, no user input
          dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(target)});` }}
        />
      </head>
      <body>
        <p>
          <a href={target}>Zur Startseite</a>
        </p>
      </body>
    </html>
  );
}
