import { E2E } from "../lib/E2E";
import { test, expect } from '@playwright/test';
import { join } from 'path';
import { Locator, Page } from 'playwright-core';


const NOTE_TITLE = "Alice's Adventures in Wonderland"; 
const MAX_DURATION = 1000;


test.describe("Notes", () => {
    process.env.APP_URL = "https://app.getpolarized.io/";

    const URL = E2E.Sessions.appURL();
    
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto(URL);
        
        await E2E.Auth.doLogin(page, "testing@getpolarized.io");
    });

    function createNoteURL(noteTitle: string): string {
        return join(URL, "notes", encodeURIComponent(noteTitle));
    }

    function noteLocator(noteTitle: string): Locator {
        return page.locator(
            '.MuiTableContainer-root:nth-child(3) > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root',
            { hasText: noteTitle }
        );
    }

    test("Can open a single note", async () => {
        await E2E.Nav.goToNotes(page);

        async function openSingleNote() {
            await noteLocator(NOTE_TITLE).dblclick();
        }

        const { duration } = await E2E.Benchmark.measure(page, "notes", async () => {
            await openSingleNote()
        });

        expect(duration).toBeLessThan(MAX_DURATION);

        await expect(page).toHaveURL(createNoteURL(NOTE_TITLE));
    });



});