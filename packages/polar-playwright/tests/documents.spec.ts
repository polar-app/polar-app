import { E2E } from "../lib/E2E";
import { test, expect } from '@playwright/test';
import { Locator, Page } from 'playwright-core';


test.describe("Documents", () => {
    const TEST_FILE_NAME = "alexnet.pdf";

    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto(E2E.Sessions.appURL());

        await E2E.Auth.doLogin(page, "testing@getpolarized.io");
    });

    test("Can upload and open a document", async () => {

        await E2E.Nav.goToDocuments(page);

        await page.locator('span[class="MuiButton-label"]', { hasText: "Add Document"}).click();

        // Note that Promise.all prevents a race condition
        // between clicking and waiting for the file chooser.
        const [ fileChooser ] = await Promise.all([
            // It is important to call waitForEvent before click to set up waiting.
            page.waitForEvent('filechooser'),
            page.locator('span[class="MuiButton-label"]', { hasText: "Upload Files"} ).click()
        ]);

        await fileChooser.setFiles(`./assets/${TEST_FILE_NAME}`);

        await page.locator(
            ".MuiSnackbarContent-message",
            { hasText: `Would you like to open '${TEST_FILE_NAME}' now?`}
        ).waitFor();

        await page.locator(
            '.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-root.MuiIconButton-colorSecondary'
        ).click();

        const titleLocator = page.locator(
            ".textLayer > span",
            { hasText: "ImageNet Classification with Deep Convolutional" }
        ).first();

        await expect(titleLocator).toBeVisible();
    });

    test("Can delete a document", async () => {
        await E2E.Nav.goToDocuments(page);

        const rowLocator = (): Locator => {
            return page.locator(
                '.MuiTableRow-root[role="checkbox"] > td',
                { hasText: TEST_FILE_NAME}
            );
        }

        await rowLocator().click({ button: "right" });

        await page.locator('span', { hasText: "Delete" }).click();

        await page.locator('.MuiButton-label', { hasText: "Accept" }).click();

        await page.locator(
            ".MuiSnackbarContent-root > .MuiSnackbarContent-message",
            { hasText: "1 documents deleted." }
        ).waitFor();

        await expect(rowLocator()).toHaveCount(0);
    });

    test.afterAll(async () => {
        await E2E.Auth.doLogout(page);
    });
});