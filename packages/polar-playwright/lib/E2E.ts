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
}
