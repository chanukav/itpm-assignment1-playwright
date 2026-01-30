import { test, expect } from "@playwright/test";


test("Pos_UI_0001 - Output updates in real time while typing", async ({ page }) => {
    await page.goto("https://www.swifttranslator.com");

    // Use number-one recommended locator for accessibility and robustness
    const input = page.getByRole("textbox");

    // Output area does not have an ID, so we find the card containing 'Sinhala' and grab the content area
    const output = page.locator('.card').filter({ hasText: 'Sinhala' }).locator('.whitespace-pre-wrap');

    await input.click();
    // Typing with delay triggers real-time translation events
    await page.keyboard.type("mama gedara yanawa", { delay: 50 });

    // Assert that output is not empty, with a generous timeout for network latency
    await expect(output).not.toHaveText("", { timeout: 10000 });
});
