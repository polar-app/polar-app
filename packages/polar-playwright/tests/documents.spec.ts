import { E2E } from "../lib/E2E";
import { test, expect } from '@playwright/test';
import { Page } from 'playwright-core';


test.describe("Documents", () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        process.env.APP_URL = "https://app.getpolarized.io/";

        page = await browser.newPage();

        page.goto(E2E.Sessions.appURL());

        E2E.Auth.doLogin(page, "testing@getpolarized.io");
    });

    test("Can upload and open a document", async () => {
        const FILE_NAME = "alexnet.pdf";

        await E2E.Nav.goToDocuments(page);

        await page.locator('span[class="MuiButton-label"]', { hasText: "Add Document"}).click();

        // Note that Promise.all prevents a race condition
        // between clicking and waiting for the file chooser.
        const [ fileChooser ] = await Promise.all([
            // It is important to call waitForEvent before click to set up waiting.
            page.waitForEvent('filechooser'),
            page.locator('span[class="MuiButton-label"]', { hasText: "Upload Files"} ).click()
        ]);

        await fileChooser.setFiles(`./assets/${FILE_NAME}`);

        await page.locator(
            ".MuiSnackbarContent-message",
            { hasText: `Would you like to open '${FILE_NAME}' now?`}
        ).waitFor();

        await page.locator(
            '.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-root.MuiIconButton-colorSecondary'
        ).click();

        await page.waitForNavigation();

        const titleLocator = page.locator(
            ".textLayer > span",
            { hasText: "ImageNet Classification with Deep Convolutional" }
        ).first();

        await expect(titleLocator).toBeVisible();
    });

});