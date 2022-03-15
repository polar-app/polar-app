import { E2E } from "../lib/E2E";
import { test, expect } from '@playwright/test';
import { join } from 'path';
import { Locator, Page } from 'playwright-core';


test.describe("Notes", () => {
    test.slow();

    let URL: string;

    // test created and deleted note title
    const TEST_NOTE_TITLE = `test_note_${Date.now()}`;

    let page: Page;

    test.beforeAll(async ({ browser }) => {
        URL = await E2E.Sessions.appURL();

        const context = await browser.newContext()
        page = await context.newPage();

        await page.goto(URL);

        await E2E.Auth.doLogin(page, "testing@getpolarized.io");
    });


    test.beforeEach(async () => {
        await E2E.Nav.goToNotes(page);
    });

    function noteLocator(noteTitle: string): Locator {
        return page.locator(
            '.MuiTableContainer-root:nth-child(3) > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root',
            { hasText: noteTitle }
        );
    }

    test("Can open a single note", async () => {
        const NOTE_TITLE = "Alice's Adventures in Wonderland";

        const MAX_DURATION = 3000;

        const noteURL = join(URL, "notes", encodeURIComponent(NOTE_TITLE))

        const { duration } = await E2E.Benchmark.measure(page, "notes", async () => {
            await noteLocator(NOTE_TITLE).dblclick();
        });

        expect(duration).toBeLessThan(MAX_DURATION);

        await expect(page).toHaveURL(noteURL);
    });


    test("Can create a new note", async () => {
        await page.locator(
            ".mui-elevation > .MuiPaper-root:nth-child(1) > .MuiBox-root > .MuiButtonBase-root",
            { hasText: "Create a new note"}
        ).click();

        await page.locator(".MuiInput-underline > input[type=text]").type(TEST_NOTE_TITLE);

        await page.locator(".MuiButton-label", { hasText: "Done" }).click();

        // extract ID from redirect url
        const blockID = page.url().split("/").pop();

        const titleLocator = page.locator(`#block-${blockID}`);

        await expect(titleLocator).toHaveText(TEST_NOTE_TITLE);
    });


    test("Can delete a note", async () => {
        // sort list by created
        await page.locator("span[role=button]", { hasText: "Created" }).click();

        await noteLocator(TEST_NOTE_TITLE).click();

        // right click to display MUI context menu
        await page.mouse.click(600, 600, { button: "right" });

        await page.locator('.MuiListItemText-root > span', { hasText: "Delete" }).click();
    });

    test.afterAll(async ({ browserName }) => {
        await E2E.Auth.doLogout(page);
    });
});
