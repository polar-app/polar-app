import {expect, test} from '@playwright/test';

const URL = process.env.APP_URL || 'http://localhost:8050';

test('Login succeeds', async ({page}) => {
    test.slow();
    await page.goto(URL!);
    await page.locator('h2', {hasText: 'Sign In to Polar'});
    await page.locator('input[type=email]').type('testing@getpolarized.io');
    await page.locator('button', {hasText: 'Sign In with Email'}).click();
    await page.locator('input[type=numeric]').type('123456');
    await page.locator('button', {hasText: 'Verify code'}).click();

    // Wait for doc repository to load
    await expect(await page.locator('button', {hasText: 'Add Document'})).toHaveText('Add Document', {timeout: 10000})
});
