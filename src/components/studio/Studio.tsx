"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { isSanityConfigured } from "../../../sanity/env";

// ssr:false'd by the page below — Studio is a client-only SPA shell; it does
// its own data fetching against Sanity's API directly from the browser, not
// through Next's server, so this is fine to statically export (plan Section
// 4.2). Auth is Sanity's own login — no extra app-level password gate.
export default function Studio() {
  if (!isSanityConfigured()) {
    return (
      <div style={{ padding: "4rem 2rem", maxWidth: 640, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1>Sanity Studio ist noch nicht eingerichtet</h1>
        <p>
          Es wurde noch kein Sanity-Projekt verbunden (NEXT_PUBLIC_SANITY_PROJECT_ID fehlt).
          Siehe Plan Abschnitt 4.5 — dieser Schritt erfordert einmalig <code>npx sanity login</code> und
          die Erstellung bzw. Auswahl eines Projekts.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
