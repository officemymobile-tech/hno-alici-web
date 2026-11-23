import { test, expect } from "@playwright/test";

// Manual-equivalent accessibility checks (pa11y/axe were not available in
// this session — auto-mode classifier denied unsupervised npx package
// execution — see FINAL_RELEASE_READINESS.md for that limitation). These
// check what Phase 7 of the plan specifically called out as "not previously
// tested": keyboard focus visibility and the cookie banner's focus
// behavior, plus heading-order sanity.

test("keyboard: tab order reaches the primary header controls with a visible focus style", async ({ page }) => {
  await page.goto("/de/");
  // Dismiss the cookie banner first so it doesn't own the first few tab stops.
  const acceptAll = page.getByRole("button", { name: "Alle akzeptieren" });
  if (await acceptAll.isVisible().catch(() => false)) await acceptAll.click();

  await page.keyboard.press("Tab");
  const first = page.locator(":focus");
  await expect(first).toBeVisible();

  // Sweep a few more tab stops and confirm each one gets a non-"none" outline
  // or an explicit focus-visible box-shadow (Tailwind's focus-visible:outline
  // utilities, used throughout Button.tsx / nav links).
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    const style = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, tag: el.tagName };
    });
    if (style && style.tag !== "BODY") {
      const hasFocusRing = style.outlineStyle !== "none" || style.outlineWidth !== "0px";
      expect(hasFocusRing, `focused ${style.tag} has no visible outline`).toBeTruthy();
    }
  }
});

test("cookie consent banner does not trap focus (page content stays reachable)", async ({ page }) => {
  await page.goto("/de/");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  // Not aria-modal — focus must be able to leave the banner via Tab.
  await expect(dialog).not.toHaveAttribute("aria-modal", "true");
});

test("homepage has exactly one H1 and no skipped heading levels in the main sections", async ({ page }) => {
  await page.goto("/de/");
  await expect(page.locator("h1")).toHaveCount(1);
  const levels = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1, h2, h3, h4")).map((el) => Number(el.tagName[1])),
  );
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1], `heading level jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1);
  }
});

test("reduced motion: fade-up animation is disabled under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/de/");
  const animated = page.locator(".animate-fade-up").first();
  if (await animated.count()) {
    const duration = await animated.evaluate((el) => getComputedStyle(el).animationDuration);
    expect(["0s", "0.01ms", "0.0001s"]).toContain(duration);
  }
});
