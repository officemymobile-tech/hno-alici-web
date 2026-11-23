import { defineConfig, devices } from "@playwright/test";

// webServer runs scripts/sanity/gh-pages-sim-server.mjs against the already-
// built out/ directory (not `next dev`) — deliberately, since the point of
// this suite (plan RC item 6, alongside item 5) is to test the actual
// static output as GitHub Pages would serve it, including the 404-fallback
// behavior, not Next's dev server.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"], ["json", { outputFile: "docs/migration/playwright-report.json" }]],
  use: {
    baseURL: "http://localhost:4181",
  },
  webServer: {
    command: "node scripts/sanity/gh-pages-sim-server.mjs 4181",
    port: 4181,
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
