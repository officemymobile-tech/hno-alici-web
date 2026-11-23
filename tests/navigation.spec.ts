import { test, expect } from "@playwright/test";

const locales = ["de", "tr"] as const;

for (const locale of locales) {
  test.describe(`navigation (${locale})`, () => {
    test(`homepage loads and has no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      const response = await page.goto(`/${locale}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(errors, `console errors on /${locale}/: ${errors.join(" | ")}`).toHaveLength(0);
    });

    test("header nav links resolve (no 404s)", async ({ page, request }) => {
      await page.goto(`/${locale}/`);
      const links = await page.locator(`header a[href^="/${locale}"]`).evaluateAll((els) =>
        els.map((el) => (el as HTMLAnchorElement).getAttribute("href")).filter(Boolean),
      );
      const unique = [...new Set(links)].slice(0, 15); // representative sample, not exhaustive
      for (const href of unique) {
        const res = await request.get(href as string);
        expect(res.status(), `link ${href} should not 404`).toBeLessThan(400);
      }
    });

    test("locale switcher goes to the other language", async ({ page }) => {
      const other = locale === "de" ? "tr" : "de";
      await page.goto(`/${locale}/`);
      const switcher = page.locator(`a[href^="/${other}"]`).first();
      if (await switcher.count() > 0) {
        await switcher.click();
        await expect(page).toHaveURL(new RegExp(`^http://localhost:4181/${other}/?`));
      }
    });

    test("footer renders with contact info", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await expect(footer).toContainText("Senefeldergasse");
    });
  });
}
