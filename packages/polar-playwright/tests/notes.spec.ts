import { E2E } from "../lib/E2E";
import { test, expect } from '@playwright/test';
import { join } from 'path';


const NOTE_TITLE = "Alice's Adventures in Wonderland"; 
const MAX_DURATION = 1000;


test("Can open a single note", async ({ page }) => {
    const URL = E2E.Sessions.appURL();

    await page.goto(URL);

    const note_url = join(URL, "notes", encodeURIComponent(NOTE_TITLE));

    await E2E.Auth.doLogin(page, "testing@getpolarized.io");
    
    await E2E.Nav.goToNotes(page);

    async function openSingleNote() {
        await page.locator(
            '.MuiTableContainer-root:nth-child(3) > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root',
            { hasText: NOTE_TITLE }
        ).dblclick();
    }

    const { duration } = await E2E.Benchmark.measure(page, "notes", async () => {
        await openSingleNote()
    });

    expect(duration).toBeLessThan(MAX_DURATION);

    await expect(page).toHaveURL(note_url);
});