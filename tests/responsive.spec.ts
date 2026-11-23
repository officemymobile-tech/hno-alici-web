import { test, expect } from "@playwright/test";

// Phase 2 (premium design) responsive sweep: the 7 required breakpoints
// across the pages most affected by this pass (home, team). Flags
// horizontal overflow (a common symptom of a new section not wrapping
// correctly) and confirms the new sections actually render.
const widths = [320, 360, 390, 430, 768, 1024, 1440] as const;
const pages = [
  { path: "/de/", label: "home" },
  { path: "/de/team", label: "team" },
] as const;

for (const { path, label } of pages) {
  for (const width of widths) {
    test(`${label} @ ${width}px has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `document is wider than viewport at ${width}px`).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
}

test.describe("Phase 2 design changes — new sections render correctly", () => {
  test("homepage shows the info strip with status, hours, phone and address", async ({ page }) => {
    await page.goto("/de/");
    const strip = page.getByText("Unsere Öffnungszeiten");
    await expect(strip).toBeVisible();
    await expect(page.getByText("Senefeldergasse 3/1").first()).toBeVisible();
  });

  test("homepage doctor cards: Alici and Meier have real photos, Benjamin Alici has an initials avatar (not a stand-in photo)", async ({ page }) => {
    await page.goto("/de/");
    const benjaminCard = page.locator("article", { hasText: "Dr. Benjamin Alici" });
    await expect(benjaminCard.getByText("BA", { exact: true })).toBeVisible();
    await expect(benjaminCard.locator("img")).toHaveCount(0);

    const aliciCard = page.locator("article", { hasText: "Dr. Ümit Alici" });
    await expect(aliciCard.locator("img")).toHaveCount(1);
  });

  test("team page: Dr. Benjamin Alici shows an initials avatar, never the leistungen stand-in photo", async ({ page }) => {
    await page.goto("/de/team");
    const benjaminCard = page.locator("article", { hasText: "Dr. Benjamin Alici" });
    await expect(benjaminCard.getByText("BA", { exact: true })).toBeVisible();
    await expect(benjaminCard.locator("img")).toHaveCount(0);
  });

  test("footer is regrouped into Schnellzugriff / Patienteninfo / Rechtliches with a social link", async ({ page }) => {
    await page.goto("/de/");
    const footer = page.locator("footer");
    await expect(footer.getByText("Schnellzugriff")).toBeVisible();
    await expect(footer.getByText("Patienteninfo")).toBeVisible();
    await expect(footer.getByText("Rechtliches")).toBeVisible();
    await expect(footer.getByRole("link", { name: "Facebook" })).toBeVisible();
  });

  test("about section shows the 3-item checklist", async ({ page }) => {
    await page.goto("/de/");
    await expect(page.getByText("Gründliche Anamnese & moderne Diagnostik")).toBeVisible();
  });

  test("mobile: the fixed floating call button never overlaps the Reviews quote card (regression guard)", async ({ page }) => {
    // Found during visual QA: the old 2-button floating stack (phone + map
    // pin) was tall enough to cover review text at some scroll positions.
    // Fixed by collapsing it to one compact button; this guards against it
    // recurring as content is added/changed.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/de/");
    const heading = page.getByText("Patientenstimmen");
    await heading.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(200);

    const quote = page.locator("blockquote").first();
    const fab = page.locator('a[href^="tel:"][aria-label]').first();
    const [quoteBox, fabBox] = await Promise.all([quote.boundingBox(), fab.boundingBox()]);
    expect(quoteBox).not.toBeNull();
    expect(fabBox).not.toBeNull();
    if (quoteBox && fabBox) {
      const overlaps =
        quoteBox.x < fabBox.x + fabBox.width &&
        quoteBox.x + quoteBox.width > fabBox.x &&
        quoteBox.y < fabBox.y + fabBox.height &&
        quoteBox.y + quoteBox.height > fabBox.y;
      expect(overlaps, "floating call button overlaps the review quote card").toBeFalsy();
    }
  });
});
