import {test} from '@playwright/test';
import {E2E} from "../lib/E2E"

test('Login/Logout succeeds', async ({page, browserName}) => {
    // Default timeout of 30 seconds is not enough for this set of steps
    test.slow();

    await page.goto(await E2E.Sessions.appURL());

    await E2E.Auth.doLogin(page, 'testing@getpolarized.io', '123456');

    await E2E.Auth.doLogout(page);

    await E2E.Sessions.reset(page, browserName);
});
