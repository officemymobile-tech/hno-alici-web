// GitHub Pages serves out/404.html (with HTTP 404) for ANY path that has no
// matching static file. Sanity Studio is a client-side-routed SPA living
// under /studio/, so a browser refresh or a direct/shared link to a Studio
// sub-route (e.g. /studio/structure/openingHours) has no matching file and
// would otherwise hit the generic "page not found" page instead of Studio.
//
// This runs as a build step AFTER `next build` (see package.json) and
// injects a small script as the very first thing in <head> of the
// generated out/404.html: for any /studio/* path, it fetches the real
// built /studio/index.html and swaps the document content for it, so the
// browser's address bar keeps the deep URL and Sanity Studio's own router
// (which reads location.pathname on mount) renders the right view — no
// visible redirect, no lost sub-path. Falls back to a plain redirect to
// /studio/ if the fetch fails for any reason. All other 404s are untouched.
import { readFileSync, writeFileSync } from "fs";

const path = "out/404.html";
const html = readFileSync(path, "utf8");

const snippet = `<script>(function(){if(location.pathname.indexOf("/studio/")===0||location.pathname==="/studio"){fetch("/studio/").then(function(r){return r.text()}).then(function(h){document.open();document.write(h);document.close()}).catch(function(){location.replace("/studio/")})}})();</script>`;

if (html.includes(snippet)) {
  console.log("[404-fallback] already injected, skipping");
} else {
  // out/404.html has no explicit <html>/<head> wrapper (a pre-existing
  // quirk of the root src/app/layout.tsx, present before any Sanity/Studio
  // work and unrelated to it — browsers' HTML5 parser auto-inserts the
  // missing structural tags, confirmed working via direct checks, so this
  // is cosmetic, not a functional break). Insert at the very start of the
  // file instead of looking for a literal <head> tag.
  const updated = snippet + html;
  writeFileSync(path, updated);
  console.log("[404-fallback] injected Studio deep-link fallback into out/404.html");
}
