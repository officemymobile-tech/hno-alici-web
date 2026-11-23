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
// page exists to serve correctly.
//
// robots: "noindex, follow" (not "nofollow") — checked against Google's
// current Search Central docs (crawling-indexing/301-redirects,
// crawling-indexing/robots-meta-tag): a 0-second meta refresh is
// documented as interpreted like a permanent redirect for canonicalization
// ("the indexing pipeline uses the redirect as a signal that the redirect
// target should be canonical"), and `nofollow` is documented only as
// blocking Google from following links on the page — there is no
// documented upside to it here, only a plausible downside (it could
// suppress Google following the no-JS fallback <a> link / discourage
// link-signal flow to the real target), so it's left off. `noindex` stays:
// Google's own redirect classification likely makes it redundant for
// Google specifically, but it's the documented, correct fix for exactly
// the real-world problem this page exists to prevent — a crawler that
// doesn't execute the meta refresh (e.g. Seobility) indexing this
// near-empty stub as if it were real content.
const target = `/${routing.defaultLocale}/`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <meta name="robots" content="noindex, follow" />
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
