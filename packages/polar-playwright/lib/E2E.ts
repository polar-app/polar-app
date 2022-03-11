import { Page } from 'playwright-core';
import http from "http";

export namespace E2E {

    export namespace Sessions {

        export async function reset(page: Page) {

            // Clear local storage
            await page.evaluate(() => window.localStorage.clear());

            // Clear cookies by setting expiry date in the past
            // Could use CookieStore API here but it's not supported on
            // Firefox or Safari...
            await page.evaluate(() =>
                document.cookie.split(';').forEach(function(c) {
                    document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                })
            );

            // Clear indexedDB 
            await page.evaluate(async () => {
                const dbs = await window.indexedDB.databases();
                dbs.forEach(db => {
                    if (db.name) {
                        window.indexedDB.deleteDatabase(db.name);
                    }
                });
            });
        }

        export async function appURL(): Promise<string> {
            
            const LOCAL_URL = "http://localhost:8050";

            // when there is no local app build running on host machine
            // or an explicitly specified APP_URL then tests should default to 
            // production version of polar.
            if (!process.env.APP_URL) {
                const isLocalAlive = await isHostAlive(LOCAL_URL);
                if (!isLocalAlive) {
                    process.env.APP_URL = "https://app.getpolarized.io/";
                }
            }

            return process.env.APP_URL || LOCAL_URL;
        }

        
        async function isHostAlive(hostURL: string): Promise<boolean> {
            return new Promise<boolean>(resolve => {
                const req = http.get(hostURL, (res) => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
                req.on('error', () => {
                    resolve(false);
                });

                req.end();
            });
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
            await Nav.goToAccount(page);
            
            await page.click(".text-right .MuiButton-label");         

            await page.click("[role='presentation'] .MuiButton-contained .MuiButton-label");

            // waits for logout to fully finish
            await page.locator('h2', {hasText: 'Sign In to Polar'}).waitFor();
        }
    }

    export namespace Nav {
        type sideNavItems = "Notes" | "Annotations" | "Documents" | "Account";
        
        export async function goToSideNavItem(page: Page, item: sideNavItems) {
            // Selector path to a sidenav item
            await page.click(`div[title="${item}"]`);
        }
        export async function goToNotes(page: Page) {
            await goToSideNavItem(page, "Notes");
        }

        export async function goToDocuments(page: Page) {
            await goToSideNavItem(page, "Documents");
        }

        export async function goToAnnotations(page: Page) {
            await goToSideNavItem(page, "Annotations");
        }

        export async function goToAccount(page: Page) {
            await goToSideNavItem(page, "Account");
        }
    }

    export namespace Benchmark {
        /**
         * @param page - test page
         * @param taskName - name of the task (used to create measure labels)
         * @param task
         * 
         * Runs a performance measure on in test page browser context
         */
        export async function measure(page: Page, 
                                      taskName: string,
                                      task: () => Promise<void>): Promise<PerformanceMeasure> {
            
            const startLabel = `${taskName}-start`;

            const measureLabel = `${taskName}-measure`;
            
            // set performance start mark
            await page.evaluate(startLabel => 
                window.performance.mark(startLabel)
            , startLabel);

            // perform the underlying task
            await task();

            // measure
            await page.evaluate(({ startLabel, measureLabel }) => 
                    window.performance.measure(measureLabel, startLabel)
            ,{ startLabel, measureLabel });

            // get measure entry by its label
            const performanceMeasureJson = await page.evaluate(measureLabel => JSON.stringify(
                window.performance.getEntriesByName(measureLabel)[0]
            ), measureLabel);

            await page.evaluate(() => {
                window.performance.clearMarks();
                window.performance.clearMeasures();
            });

            return <PerformanceMeasure>JSON.parse(performanceMeasureJson);
        }
    }
}
