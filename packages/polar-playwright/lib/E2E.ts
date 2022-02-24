import { Page } from 'playwright-core';

export namespace E2E {

    export namespace Sessions {

        export async function reset(page: Page) {

            // Clear local storage
            await page.evaluate("window.localStorage.reset()")

            // Clear cookies by setting expiry date in the past
            // Could use CookieStore API here but it's not supported on
            // Firefox or Safari...
            await page.evaluate(`
                document.cookie.split(';').forEach(function(c) {
                      document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                });
            `)

            // Clear indexedDB 
            await page.evaluate(`
                window.indexedDB.databases.forEach(function(db) {
                    window.indexedDB.deleteDatabase(db.name)
                })
            `);
        }

        export function appURL(): string {
            return process.env.APP_URL || 'http://localhost:8050';
        }

    }

    export namespace Auth {

        export async function doLogin(page: Page, email: string, code: string) {

            await page.locator('h2', {hasText: 'Sign In to Polar'}).waitFor()

            await page.locator('input[type=email]').type(email);

            await page.locator('button', {hasText: 'Sign In with Email'}).click();

            await page.locator('button', {hasText: 'VERIFY CODE'}).waitFor();

            await page.locator('input[type=numeric]').type(code);

            await page.locator('button', {hasText: 'VERIFY CODE'}).click();

            // Wait for doc repository to load
            await page.locator('button', {hasText: 'Add Document'}).waitFor();
        }
    }

    export namespace Nav {
        export async function goToNotes(page: Page) {

            // Selector path to notes icon
            await page.click("#sidenav > div > div:nth-child(5) > svg > path");

            await page.waitForTimeout(1000);
        }
    }
}
