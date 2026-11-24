import { test, expect } from "@playwright/test";

// Regression tests for finding config:dead-security-headers:vercel-json
// (SECURITY_AUDIT_FINAL_REPORT.md, 2026-11-23). vercel.json's header policy
// never applied on GitHub Pages; this verifies the <meta>-delivered CSP
// that replaces it actually reaches the page and does not break the one
// thing this static-export architecture needs client-side JS for: the root
// redirect stub and locale-page hydration.

test("CSP meta tag is present on the homepage", async ({ page }) => {
  await page.goto("/de/");
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute("content");
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
});

test("root path (/) still redirects to /de/ under the new CSP, with no console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page).toHaveURL(/\/de\/?$/);
  expect(errors, `console errors on /: ${errors.join(" | ")}`).toHaveLength(0);
});

test("CSP meta tag is present on the root redirect stub", async ({ page }) => {
  // Disable JS-less: just check the tag exists in the served HTML directly,
  // since the page navigates away immediately once JS runs.
  const response = await page.request.get("/");
  const html = await response.text();
  expect(html).toContain('http-equiv="Content-Security-Policy"');
});
