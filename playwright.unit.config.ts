import { defineConfig } from "@playwright/test";

// Separate from playwright.config.ts on purpose: these are pure Node-side
// regression tests for the two stored-XSS fixes (jsonLdScript escaping,
// LegalDocument rendering) found by the 2026-11-23 security audit. They
// import source modules directly and render with react-dom/server — no
// browser, no built site, no live Sanity data. Run with:
//   npx playwright test --config=playwright.unit.config.ts
export default defineConfig({
  testDir: "./tests/unit",
  fullyParallel: true,
  reporter: [["list"]],
});
