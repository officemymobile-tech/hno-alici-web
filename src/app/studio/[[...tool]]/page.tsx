import type { Metadata } from "next";
import StudioLoader from "@/components/studio/StudioLoader";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

// Required under output: "export" for a dynamic [[...tool]] segment. Only the
// root shell (/studio) is pre-rendered; Sanity Studio then takes over all
// further routing client-side via the History API.
//
// KNOWN LIMITATION (flag for the Phase 4 migration report, not silently
// assumed to work): a hard refresh or a shared deep link straight to a
// Studio sub-route (e.g. /studio/structure/openingHours) will 404 on GitHub
// Pages, which has no server to fall back to this shell for unknown paths.
// GitHub Pages' documented workaround is a custom 404.html that re-serves
// this page's HTML (a standard static-host SPA-fallback trick) — needs to be
// added before Studio is relied on for real day-to-day editing, verified as
// part of the Phase 4.6 verification test, not assumed here.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioLoader />;
}
