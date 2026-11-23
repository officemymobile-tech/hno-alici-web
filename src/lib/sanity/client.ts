import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken, isSanityConfigured } from "../../../sanity/env";

export { isSanityConfigured };

// Build-time-only GROQ fetches — no unstable_cache, no revalidateTag, no live
// /api/revalidate route, none of which work under output: "export" (plan
// Section 4.3). perspective: "published" means a draft document can never
// leak into a static build (the Phase 4.6 draft-safety test checks exactly
// this). useCdn: false on purpose during this verification phase — CDN
// caching would delay seeing a just-published change by up to ~60s, which
// would make the Section 4.6 "publish → rebuild sees it" test flaky.
export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: readToken,
});
