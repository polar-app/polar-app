import {test} from '@playwright/test';
import { E2E } from "../lib/E2E"

const URL = process.env.APP_URL || 'http://localhost:8050';

test('Login succeeds', async ({page}) => {
    await page.goto(URL);

    await E2E.Auth.doLogin(page, 'testing@getpolarized.io', '123456');
});
