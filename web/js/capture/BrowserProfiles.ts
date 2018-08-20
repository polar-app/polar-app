import {Browser, BrowserProfileBuilder} from './Browser';
import {BrowserProfile} from './BrowserProfile';

// TODO: anything greater than 10k triggers a bug on NVidia drivers on Linux
// but many documents are larger than this 10k limit if they have 10 pages or
// more.
//
// Examples:
//
// https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2
//
// It's also an issue that this will use more memory. About 100MB for large
// documents that need rendering with full windows.

export class BrowserProfiles {

    /**
     * Migrate this to a profile of setting we then use to create the browser
     * window options.
     *
     * @param browser {BrowserProfile}
     * @param name {string} The name of the profile to use.
     * @return {BrowserProfile}
     */
    static toBrowserProfile(browser: Browser, name: string): BrowserProfile {

        // support offscreen rendering (similar to chrome headless)
        //
        // https://electronjs.org/docs/tutorial/offscreen-rendering

        switch (name) {

            case "hidden":
                return new BrowserProfileBuilder(browser)
                    .setProfile(name)
                    .setHeight(35000)
                    .setShow(false)
                    .build();

            case "headless":
                return new BrowserProfileBuilder(browser)
                    .setProfile(name)
                    .setHeight(35000)
                    .setShow(true)
                    .setOffscreen(true)
                    .build();

            case "headless_500":
                return new BrowserProfileBuilder(browser)
                    .setProfile(name)
                    .setHeight(500)
                    .setShow(false)
                    .setOffscreen(true)
                    .build();


            case "default":
                return new BrowserProfileBuilder(browser)
                    .setProfile(name)
                    .setHeight(500)
                    .setShow(true)
                    .setOffscreen(false)
                    .build();

            // case "default_500":
            //     return Browsers.createDefault(browser, 500);
            //
            // case "test":
            //     return Browsers.createDefault(browser, 10000);
            //
            // case "default_5000":
            //     return Browsers.createDefault(browser, 5000);
            //
            // case "default":
            //     return browser;

            default:
                throw new Error("Incorrect profile name: " + name);

        }

    }

    /**
     *
     * @param browser {BrowserProfile}
     * @param height {number}
     * @return {BrowserProfile}
     */
    static createDefault(browser: Browser, height: number) {
        browser = Object.assign({}, browser);

        /**
         * The page height we should use when loading the document.  It
         * might make sense in the future to just set this to
         * document.body.scrollHeight after the page loads.  In fact
         * this will definitely need to be changed.  Some javascript and
         * CSS can display things at the bottom of the window so it
         * could make the captured page look massive.
         */

        browser.deviceEmulation.screenSize.height = height;
        browser.deviceEmulation.viewSize.height = height;

        return browser;
    }

}


