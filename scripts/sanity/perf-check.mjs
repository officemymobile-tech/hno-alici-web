// Lightweight performance probe — Lighthouse CLI was not available in this
// session (auto-mode classifier denied unsupervised npx package execution),
// so this measures real Navigation Timing + resource-transfer data via
// Playwright directly against the static build (not `next dev`). Not a
// Lighthouse score — a smaller, honest substitute: real milliseconds and
// real bytes, clearly labeled as such in PERFORMANCE_REPORT.md.
import { chromium } from "playwright-core";

const BASE = process.argv[2] || "http://localhost:8084";
const pages = ["/de/", "/de/leistungen/allgemeine-hno", "/de/team"];
const viewports = [
  { label: "mobile", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const path of pages) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const requests = [];
    page.on("response", async (res) => {
      try {
        const body = await res.body().catch(() => Buffer.alloc(0));
        requests.push({ url: res.url(), size: body.length, type: res.request().resourceType() });
      } catch {
        /* ignore */
      }
    });

    const start = Date.now();
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    const wallLoadMs = Date.now() - start;

    const timing = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType("navigation");
      const paint = performance.getEntriesByType("paint");
      const fcp = paint.find((p) => p.name === "first-contentful-paint");
      return {
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        loadEvent: Math.round(nav.loadEventEnd - nav.startTime),
        fcp: fcp ? Math.round(fcp.startTime) : null,
      };
    });

    const totalBytes = requests.reduce((sum, r) => sum + r.size, 0);
    const byType = requests.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + r.size;
      return acc;
    }, {});

    console.log(`\n=== ${path} (${vp.label}, ${vp.width}px) ===`);
    console.log(`  wall load: ${wallLoadMs}ms | TTFB: ${timing.ttfb}ms | FCP: ${timing.fcp}ms | DCL: ${timing.domContentLoaded}ms | load event: ${timing.loadEvent}ms`);
    console.log(`  requests: ${requests.length} | total transferred: ${(totalBytes / 1024).toFixed(0)}KB`);
    console.log(`  by type (KB):`, Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, (v / 1024).toFixed(0)])));
    const largestImages = requests.filter((r) => r.type === "image").sort((a, b) => b.size - a.size).slice(0, 3);
    if (largestImages.length) {
      console.log(`  largest images:`, largestImages.map((i) => `${i.url.split("/").pop()} (${(i.size / 1024).toFixed(0)}KB)`));
    }

    await page.close();
  }
}
await browser.close();
