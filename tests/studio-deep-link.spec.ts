import { test, expect } from "@playwright/test";

// These test the GitHub-Pages-behavior simulator (scripts/sanity/gh-pages-sim-server.mjs),
// which precisely mimics GitHub Pages' real unmatched-path behavior (HTTP 404
// status + 404.html's content as the body) — not just a generic dev-server
// fallback. This is the real-browser verification for RC item 5.
test.describe("Studio reachability after GitHub-Pages-style deep links/reloads", () => {
  test("direct navigation to /studio/ (the root) loads Studio normally", async ({ page }) => {
    const res = await page.goto("/studio/");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle("Studio");
  });

  test("a hard reload on /studio/ still works (simulates a browser refresh)", async ({ page }) => {
    await page.goto("/studio/");
    const res = await page.reload();
    expect(res?.status()).toBe(200);
  });

  test("a direct link to a deep Studio sub-route does not show the generic 404 page", async ({ page }) => {
    // This path has no matching static file, so GitHub Pages (and our
    // simulator) returns HTTP 404 with 404.html's body — the test is
    // whether the INJECTED fallback script then fetches and swaps in the
    // real Studio bundle client-side, so the user never actually sees
    // "404: This page could not be found."
    const response = await page.goto("/studio/structure/openingHours", { waitUntil: "networkidle" });
    // The raw HTTP status genuinely is 404 (that's correct/expected and
    // matches real GitHub Pages behavior) — what matters is what the user
    // ends up seeing after the fallback script runs.
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).not.toContainText("This page could not be found", { timeout: 5000 });
  });

  test("a genuinely nonexistent path still shows the real 404 message (fallback doesn't over-trigger)", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-at-all");
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toContainText("This page could not be found");
  });
});
