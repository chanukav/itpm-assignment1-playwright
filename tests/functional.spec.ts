import { test, expect } from "@playwright/test";
import cases from "../test-data/cases.json";

test.describe("SwiftTranslator Singlish -> Sinhala", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.swifttranslator.com/");
  });

  for (const tc of cases as any[]) {
    test(`${tc.id} - ${tc.name}`, async ({ page }, testInfo) => {
      // Add metadata for reporter
      testInfo.annotations.push({ type: 'input', description: tc.input });
      testInfo.annotations.push({ type: 'expected', description: tc.expected });

      // Use robust selectors identified from UI testing
      const input = page.getByRole("textbox");
      // Output area locator: Find the card with 'Sinhala' title, then the content div
      // Using .first() on the content div if needed, but text filtering is safer
      const output = page.locator('.card').filter({ hasText: 'Sinhala' }).locator('.whitespace-pre-wrap');

      // Chunk the input to allow the app to process events in batches
      // This solves the issue of the event loop getting flooded or the app debounce missing the end
      const chunkSize = 50;
      for (let i = 0; i < tc.input.length; i += chunkSize) {
        const chunk = tc.input.slice(i, i + chunkSize);
        await input.pressSequentially(chunk, { delay: 10 });
        // Small breathing room for the app's event loop
        await page.waitForTimeout(50);
      }

      // Wait for real-time output to appear
      // For exact matches, we can wait for the specific text which is more robust
      if (tc.expectType === "exact") {
        await expect(output).toHaveText(tc.expected, { timeout: 20000 });
      } else {
        // For others, wait for something to appear
        await expect(output).not.toHaveText("", { timeout: 15000 });
      }

      const actual = (await output.innerText()).trim();

      // Attach actual result for reporter
      await testInfo.attach('actual', { body: actual, contentType: 'text/plain' });

      if (tc.expectType === "exact") {
        // Redundant but keeps the structure clear and ensures specific failure message if toHaveText passed (unlikely to fail here)
        expect(actual).toBe(tc.expected);
      } else if (tc.expectType === "nonEmptySinhala") {
        // Basic heuristic: Sinhala Unicode range approx \u0D80-\u0DFF
        expect(actual).toMatch(/[\u0D80-\u0DFF]/);
      } else if (tc.expectType === "containsEnglishTerms") {
        for (const term of tc.mustContain as string[]) {
          expect(actual).toContain(term);
        }
      }
    });
  }
});
