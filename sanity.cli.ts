import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Avoids an interactive app-id prompt on future `sanity deploy` runs —
  // the id Sanity assigned to this project's one hosted Studio app
  // (hno-alici-web.sanity.studio) on first deploy.
  deployment: { appId: "iceio5thj7ttebmeqb20hb1a" },
  // `sanity build`/`sanity deploy` is Vite-based and, by Vite's own default,
  // copies this repo's ENTIRE public/ folder (the Next.js app's static
  // assets — including public/admin/*, the legacy admin panel, and every
  // real site photo) verbatim into the Studio's build output. That's fine
  // for the Next.js-embedded /studio route (Next.js owns public/ there, not
  // a separate dist/ folder), but it would leak all of that onto the
  // independent *.sanity.studio deployment, which has no reason to need any
  // of it. This file only affects CLI commands (build/deploy/dev) — it does
  // not touch public/, the Next.js app, or sanity.config.ts (basePath/
  // projectId/dataset/schema/structure), so the embedded /studio route is
  // unaffected.
  vite: (config) => ({ ...config, publicDir: false }),
});
