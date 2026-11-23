// Phase 5 performance measurement — real Lighthouse CLI was attempted and
// denied by the auto-mode permission classifier (unsupervised npx package
// execution) in this session; this measures real Navigation Timing API
// data, real transferred bytes, and real CLS (via PerformanceObserver) for
// the 5 pages requested, mobile + desktop, against the actual static build.
// Not a Lighthouse score — real milliseconds/bytes/CLS, honestly labeled.
import { chromium } from "playwright-core";

const BASE = process.argv[2] || "http://localhost:8092";
const pages = [
  { path: "/de/", label: "Homepage" },
  { path: "/de/leistungen", label: "Leistungen" },
  { path: "/de/team", label: "Team" },
  { path: "/de/dr-uemit-alici", label: "Arztprofil" },
  { path: "/de/kontakt", label: "Kontakt" },
];
const viewports = [
  { label: "mobile", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const p of pages) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const requests = [];
    page.on("response", async (res) => {
      try {
        const body = await res.body().catch(() => Buffer.alloc(0));
        requests.push({ size: body.length, type: res.request().resourceType() });
      } catch { /* ignore */ }
    });

    await page.addInitScript(() => {
      window.__lcp = 0;
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch { /* ignore */ }
    });

    const start = Date.now();
    await page.goto(`${BASE}${p.path}`, { waitUntil: "load" });
    const wallLoadMs = Date.now() - start;
    await page.waitForTimeout(1500);
    // Force LCP finalization: a visibility/input-like signal (click) ends the LCP window in Chromium.
    await page.mouse.move(5, 5);
    await page.waitForTimeout(200);

    const timing = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType("navigation");
      const paint = performance.getEntriesByType("paint");
      const fcp = paint.find((e) => e.name === "first-contentful-paint");
      return {
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        loadEvent: Math.round(nav.loadEventEnd - nav.startTime),
        fcp: fcp ? Math.round(fcp.startTime) : null,
        lcp: window.__lcp ? Math.round(window.__lcp) : null,
      };
    });

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let value = 0;
        try {
          const obs = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) value += entry.value;
            }
          });
          obs.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(value), 300);
        } catch {
          resolve(null);
        }
      });
    });

    const totalKB = Math.round(requests.reduce((s, r) => s + r.size, 0) / 1024);
    console.log(`${p.label} (${vp.label}): wall=${wallLoadMs}ms TTFB=${timing.ttfb}ms FCP=${timing.fcp}ms LCP=${timing.lcp}ms DCL=${timing.domContentLoaded}ms load=${timing.loadEvent}ms CLS=${cls} totalKB=${totalKB} requests=${requests.length}`);

    await page.close();
  }
}
await browser.close();
