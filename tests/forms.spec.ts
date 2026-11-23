import { test, expect } from "@playwright/test";

test.describe("appointment form (/de/termin)", () => {
  test("H1 shows the corrected 'Terminanfrage senden' title, not the old 'Online Termin' overclaim", async ({ page }) => {
    await page.goto("/de/termin");
    await expect(page.locator("h1")).toHaveText("Terminanfrage senden");
  });

  test("TR H1 shows the corrected title", async ({ page }) => {
    await page.goto("/tr/termin");
    await expect(page.locator("h1")).toHaveText("Randevu Talebi Gönder");
  });

  test("submitting without consent does not submit (native required-checkbox validation)", async ({ page }) => {
    // Note: the consent checkbox has the native `required` attribute, so
    // the browser's own HTML5 validation blocks the submit event before
    // AppointmentForm's onSubmit handler (and its custom consentRequired
    // message) ever runs — confirmed by observation, not assumed. The
    // custom JS-level message is effectively unreachable in a standards
    //-compliant browser; flagged as a minor finding, not tested directly
    // here since it can't fire. What's actually verified: the form does
    // NOT reach the submitted/thank-you state without consent checked.
    await page.goto("/de/termin");
    await page.getByLabel(/^Name/i).first().fill("Test Patient");
    await page.getByLabel(/Telefon/i).first().fill("+436601234567");
    await page.getByRole("button", { name: /Anfrage senden/i }).click();
    await expect(page.getByText(/Wir melden uns schnellstmöglich/i)).not.toBeVisible();
    const consentCheckbox = page.locator('input[name="consent"]');
    expect(await consentCheckbox.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  });

  test("required name/phone fields block submission when empty", async ({ page }) => {
    await page.goto("/de/termin");
    const nameInput = page.getByLabel(/Name/i).first();
    await expect(nameInput).toHaveAttribute("required", "");
    const phoneInput = page.getByLabel(/Telefon/i).first();
    await expect(phoneInput).toHaveAttribute("required", "");
  });

  test("filling the form, checking consent, and submitting shows the thank-you state", async ({ page }) => {
    await page.goto("/de/termin");
    await page.getByLabel(/^Name/i).first().fill("Test Patient");
    await page.getByLabel(/Telefon/i).first().fill("+436601234567");
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: /Anfrage senden/i }).click();
    // handleSubmit sets window.location.href to a mailto: URL (which the
    // browser hands to the OS mail client without navigating away) and then
    // setSubmitted(true) — so the thank-you message should render in place.
    await expect(page.getByText(/Wir melden uns schnellstmöglich/i)).toBeVisible({ timeout: 5000 });
  });

  test("primary CTA is the phone number, not a fake instant-booking promise", async ({ page }) => {
    await page.goto("/de/termin");
    await expect(page.getByText(/Schnellster Weg: Telefonisch/i)).toBeVisible();
  });
});
