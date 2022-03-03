import { Page } from 'playwright-core';

export namespace E2E {

    export namespace Sessions {

        export async function reset(page: Page) {

            // Clear local storage
            await page.evaluate("window.localStorage.clear()")

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

        const FIXED_CODE = '123456';

        export async function doLogin(page: Page, email: string, code: string = FIXED_CODE) {

            await page.locator('h2', {hasText: 'Sign In to Polar'}).waitFor()

            await page.locator('input[type=email]').type(email);

            await page.locator('button', {hasText: 'Sign In with Email'}).click();

            const verifyButton = page.locator('button', {hasText: 'VERIFY CODE'});

            await verifyButton.waitFor();

            await page.locator('input[type=numeric]').type(code);

            await verifyButton.click();

            // Wait for doc repository to load
            await page.locator('button', {hasText: 'Add Document'}).waitFor();
        }

        export async function doLogout(page: Page) {
            await page.click("#sidenav > div > div:nth-child(10) > div:nth-child(2) > div > svg > path");
            
            await page.click(".text-right .MuiButton-label");         

            await page.click("[role='presentation'] .MuiButton-contained .MuiButton-label");

            // waits for logout to fully finish
            await page.locator('h2', {hasText: 'Sign In to Polar'}).waitFor();
        }
    }

    export namespace Nav {
        export async function goToNotes(page: Page) {

            // Selector path to notes icon
            await page.click('#sidenav > div > [title="Notes"]');

            await page.waitForSelector(".MuiTableContainer-root::nth-child(3)");
        }
    }

    export namespace Benchmark {
        export async function measure(taskName: string, task: () => Promise<void>): Promise<PerformanceMeasure> {
            const startLabel = `${taskName}-start`;

            const resultLabel = `${taskName}-result`;

            performance.mark(startLabel);

            await task();

            const performanceMeasure = performance.measure(resultLabel, startLabel);

            performance.clearMarks();

            return performanceMeasure;
        }
    }
}
