import { test, expect } from "@playwright/test";

test.describe("SEO regression guards (Phase 2/3 findings)", () => {
  test("title tag is not duplicated on the previously-buggy landing pages", async ({ page }) => {
    for (const path of ["/de/turk-kbb-doktoru-wien", "/tr/turk-kbb-doktoru-wien", "/de/cocuk-kbb-wien-1100", "/tr/cocuk-kbb-wien-1100"]) {
      await page.goto(path);
      const title = await page.title();
      const occurrences = title.split("Dr. Ümit Alici").length - 1;
      expect(occurrences, `title "${title}" on ${path} should mention the site name once`).toBeLessThanOrEqual(1);
    }
  });

  test("canonical tags point at a real URL (not empty, not the homepage for a distinct page)", async ({ page }) => {
    await page.goto("/de/tuerkischer-hno-arzt-wien");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/de/tuerkischer-hno-arzt-wien");
  });

  test("the duplicate-content variant canonicalizes to its real counterpart, not the homepage", async ({ page }) => {
    await page.goto("/de/turk-kbb-doktoru-wien");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/tr/turk-kbb-doktoru-wien");
    expect(canonical).not.toMatch(/\/de\/?$/);
  });

  test("hreflang pair is reciprocal between the two real landing pages", async ({ page }) => {
    await page.goto("/de/kinder-hno-wien-1100");
    const trAlt = await page.locator('link[rel="alternate"][hreflang="tr-AT"]').getAttribute("href");
    expect(trAlt).toContain("/tr/cocuk-kbb-wien-1100");
  });

  test("hreflang uses region-specific codes (de-AT/tr-AT, not bare de/tr)", async ({ page }) => {
    await page.goto("/de/");
    await expect(page.locator('link[rel="alternate"][hreflang="de-AT"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="tr-AT"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });

  test("MedicalClinic JSON-LD shows the real split-shift Monday/Wednesday hours", async ({ page }) => {
    await page.goto("/de/");
    const ldJsonTexts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const clinic = ldJsonTexts.map((t) => JSON.parse(t)).find((j) => j["@type"] === "MedicalClinic");
    expect(clinic).toBeTruthy();
    const monday = clinic.openingHoursSpecification.filter((s: { dayOfWeek: string }) => s.dayOfWeek === "Monday");
    expect(monday.length).toBe(2);
    expect(monday.some((w: { closes: string }) => w.closes === "13:00")).toBeTruthy();
    expect(monday.some((w: { opens: string }) => w.opens === "14:00")).toBeTruthy();
  });

  test("robots.txt disallows /admin/ and /studio/", async ({ request }) => {
    const res = await request.get("/robots.txt");
    const body = await res.text();
    expect(body).toContain("Disallow: /admin/");
    expect(body).toContain("Disallow: /studio/");
  });

  test("every simple page has its own distinct <title> (regression guard — 15 pages were previously all inheriting the homepage's default title)", async ({ page }) => {
    const paths = ["/de/team", "/de/kontakt", "/de/termin", "/de/bewertungen", "/de/patienteninfo", "/de/leistungen", "/de/impressum", "/de/datenschutz", "/de/dr-uemit-alici"];
    const titles = new Set<string>();
    for (const path of paths) {
      await page.goto(path);
      const title = await page.title();
      expect(titles.has(title), `title "${title}" is duplicated — ${path} should have its own`).toBeFalsy();
      titles.add(title);
    }
  });

  test("no page's metaTitle doubles up the site's own brand suffix (the allgemeine-hno-class bug)", async ({ page }) => {
    await page.goto("/de/leistungen/allgemeine-hno");
    const title = await page.title();
    const occurrences = title.split("Dr. Ümit Alici").length - 1;
    expect(occurrences, `title "${title}" mentions the brand name more than once`).toBeLessThanOrEqual(1);
  });
});
