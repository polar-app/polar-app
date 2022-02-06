import { test } from '@playwright/test';

const URL = process.env.APP_URL || 'http://localhost:8050';

test('basic test', async ({ page }) => {
  await page.goto(URL!);
});