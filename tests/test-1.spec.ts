import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/');
  await page.getByRole('textbox', { name: 'Input Your Singlish Text Here.' }).click();
  await page.getByRole('textbox', { name: 'Input Your Singlish Text Here.' }).fill('mama gedhara yanavaa.');
  await page.getByLabel('Clear').click();
  await expect(page.getByRole('textbox', { name: 'Input Your Singlish Text Here.' })).toBeVisible();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - text: Singlish
    - button "Undo":
      - img
    - button "Redo":
      - img
    - textbox "Input Your Singlish Text Here."
    - button "Open File":
      - img
    - button "Copy":
      - img
    - button "Cut":
      - img
    - button "Paste":
      - img
    - button "Clear":
      - img
    - button "Swap Languages":
      - img
    - text: Sinhala
    - button "Copy":
      - img
    - button "Clear":
      - img
    `);
});