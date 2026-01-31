import { test, expect } from "@playwright/test";
import cases from "../test-data/negative_cases.json";

test.describe("SwiftTranslator Singlish -> Sinhala (Negative)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://www.swifttranslator.com/");
    });

    for (const tc of cases as any[]) {
        test(`${tc.id} - ${tc.name}`, async ({ page }, testInfo) => {
            // Add metadata for reporter
            testInfo.annotations.push({ type: 'input', description: tc.input });
            testInfo.annotations.push({ type: 'expected', description: tc.expected });
            // Add coverage annotation strictly for Negative tests
            testInfo.annotations.push({ type: 'coverage', description: "Negative Scenario" });

            // Use robust selectors identified from UI testing
            const input = page.getByRole("textbox");
            // Smart Input Strategy
            await input.click();
            await input.clear();

            const threshold = 60;
            if (tc.input.length < threshold) {
                await input.pressSequentially(tc.input, { delay: 50 });
            } else {
                const splitIndex = tc.input.length - 20;
                const prefix = tc.input.slice(0, splitIndex);
                const suffix = tc.input.slice(splitIndex);

                await input.fill(prefix);
                await input.pressSequentially(suffix, { delay: 50 });
            }

            if (tc.expectType === "uiComponent" && tc.locator) {
                const uiElement = page.locator(tc.locator);
                await expect(uiElement).toBeVisible();
                await expect(uiElement).toContainText(tc.expected);

                // For UI component tests, the "actual" is that the element is visible/contains text
                // We can capture the text content of the element as "actual"
                const actualText = await uiElement.innerText();
                await testInfo.attach('actual', { body: actualText, contentType: 'text/plain' });
                return;
            }

            // Output area locator: Find the card with 'Sinhala' title, then the content div
            // Using .first() on the content div if needed, but text filtering is safer
            const output = page.locator('.card').filter({ hasText: 'Sinhala' }).locator('.whitespace-pre-wrap');

            // Wait for real-time output to appear
            if (tc.expectType === "exact" || tc.expectType === "passthrough") {
                // For exact/passthrough, wait for the expected text
                const expectedText = tc.expectType === "passthrough" ? tc.input : tc.expected;
                await expect(output).toHaveText(expectedText, { timeout: 20000 });
            } else {
                await expect(output).not.toHaveText("", { timeout: 15000 });
            }

            const actual = (await output.innerText()).trim();

            await testInfo.attach('actual', { body: actual, contentType: 'text/plain' });

            if (tc.expectType === "exact") {
                expect(actual).toBe(tc.expected);
            } else if (tc.expectType === "nonEmptySinhala") {
                // Basic heuristic: Sinhala Unicode range approx \u0D80-\u0DFF
                expect(actual).toMatch(/[\u0D80-\u0DFF]/);
            } else if (tc.expectType === "containsEnglishTerms") {
                for (const term of tc.mustContain as string[]) {
                    expect(actual).toContain(term);
                }
            } else if (tc.expectType === "passthrough") {
                expect(actual).toBe(tc.input);
            }
        });
    }
});
