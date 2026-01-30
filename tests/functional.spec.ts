import { test, expect } from "@playwright/test";
import cases from "../test-data/cases.json";

test.describe("SwiftTranslator Singlish -> Sinhala", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.swifttranslator.com/");
  });

  for (const tc of cases as any[]) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
      // Use robust selectors identified from UI testing
      const input = page.getByRole("textbox");
      // Output area locator: Find the card with 'Sinhala' title, then the content div
      // Using .first() on the content div if needed, but text filtering is safer
      const output = page.locator('.card').filter({ hasText: 'Sinhala' }).locator('.whitespace-pre-wrap');

      await input.fill(tc.input);

      // Wait for real-time output to appear
      await expect(output).not.toHaveText("", { timeout: 10000 });

      const actual = (await output.innerText()).trim();

      if (tc.expectType === "exact") {
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
