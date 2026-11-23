import { test, expect } from "@playwright/test";

// Premium mega-menu redesign (2026-11-22). Covers the real bug found and
// fixed during that pass: a mouse click was toggling the panel shut again
// immediately, because `mouseenter` (which opens the panel) fires before
// the `click` event during a real mouse click, and the old handler treated
// click as a toggle — so clicking the trigger opened then instantly closed
// it. Click is no longer a toggle; see ServicesMegaMenu.tsx's comment.
test.describe("Services mega menu (desktop, >=1024px)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("click opens the panel and it stays open (the fixed bug)", async ({ page }) => {
    await page.goto("/de/");
    const trigger = page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" });
    await trigger.click();
    await expect(page.getByTestId("mega-menu-panel")).toBeVisible();
  });

  test("all 3 categories show a real description, not just a bare title (the imbalance fix)", async ({ page }) => {
    await page.goto("/de/");
    await page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" }).click();
    const panel = page.getByTestId("mega-menu-panel");
    await expect(panel.getByText("Allgemeine HNO")).toBeVisible();
    await expect(panel.getByText(/Diagnostik und Behandlung von Erkrankungen/)).toBeVisible();
    await expect(panel.getByText("Kinder-HNO")).toBeVisible();
    await expect(panel.getByText(/Spezialisierte Versorgung für Kinder/)).toBeVisible();
    await expect(panel.getByText("Allergologie")).toBeVisible();
    await expect(panel.getByText(/Abklärung und Behandlung allergischer/)).toBeVisible();
  });

  test("footer CTAs go to real destinations with non-misleading labels", async ({ page }) => {
    await page.goto("/de/");
    await page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" }).click();
    const panel = page.getByTestId("mega-menu-panel");
    await expect(panel.getByRole("link", { name: /Alle Leistungen/ })).toHaveAttribute("href", "/de/leistungen/");
    await expect(panel.getByRole("link", { name: "Terminanfrage senden" })).toHaveAttribute("href", "/de/termin/");
  });

  test("keyboard: Enter opens, Tab moves focus inside, Escape closes", async ({ page }) => {
    await page.goto("/de/");
    const trigger = page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("mega-menu-panel").getByRole("link", { name: /Allgemeine HNO/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking outside closes the panel", async ({ page }) => {
    await page.goto("/de/");
    const trigger = page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" });
    await trigger.click();
    await expect(page.getByTestId("mega-menu-panel")).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByTestId("mega-menu-panel")).toBeHidden();
  });

  test("panel stays within the viewport at 1024px (narrowest desktop width)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/de/");
    await page.getByLabel("Hauptnavigation").getByRole("button", { name: "Leistungen" }).click();
    const box = await page.getByTestId("mega-menu-panel").boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(1024);
    }
  });

  test("TR locale: menu opens with translated categories", async ({ page }) => {
    await page.goto("/tr/");
    await page.getByLabel("Hauptnavigation").getByRole("button", { name: "Hizmetler" }).click();
    const panel = page.getByTestId("mega-menu-panel");
    await expect(panel.getByText("Genel KBB", { exact: true })).toBeVisible();
    await expect(panel.getByText("Çocuk KBB", { exact: true })).toBeVisible();
    await expect(panel.getByText("Alerji", { exact: true })).toBeVisible();
  });
});

test.describe("Services menu (mobile/tablet, <1024px — accordion, not the desktop panel)", () => {
  for (const width of [768, 390, 320] as const) {
    test(`@ ${width}px: opens as an in-place accordion, no overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/de/");
      await page.getByLabel("Menü").click();
      const mobileNav = page.getByLabel("Mobile Navigation");
      await mobileNav.getByRole("button", { name: "Leistungen" }).click();
      await expect(mobileNav.getByRole("link", { name: "Hörtest" })).toBeVisible();

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }

  test("touch targets are at least 24px tall (WCAG 2.2 AA)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/de/");
    await page.getByLabel("Menü").click();
    const mobileNav = page.getByLabel("Mobile Navigation");
    await mobileNav.getByRole("button", { name: "Leistungen" }).click();
    const box = await mobileNav.getByRole("link", { name: "Hörtest" }).boundingBox();
    expect(box).not.toBeNull();
    if (box) expect(box.height).toBeGreaterThanOrEqual(24);
  });
});
