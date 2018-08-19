
const {Browser} = require("./Browser");

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

class Browsers {

    /**
     * Migrate this to a profile of setting we then use to create the browser
     * window options.
     *
     * @param browser {Browser}
     * @param name {string} The name of the profile to use.
     * @return {Browser}
     */
    static toProfile(browser, name) {

        // support offscreen rendering (similar to chrome headless)
        //
        // https://electronjs.org/docs/tutorial/offscreen-rendering

        switch (name) {

            case "hidden":
                return new BrowserMutator(browser)
                    .setHeight(35000)
                    .setShow(false)
                    .build();

            case "headless":
                return new BrowserMutator(browser)
                    .setHeight(35000)
                    .setShow(true)
                    .setOffscreen(true)
                    .build();

            case "headless_500":
                return new BrowserMutator(browser)
                    .setHeight(500)
                    .setShow(false)
                    .setOffscreen(true)
                    .build();

            case "default_500":
                return Browsers.createDefault(browser, 500);

            case "test":
                return Browsers.createDefault(browser, 10000);

            case "default_5000":
                return Browsers.createDefault(browser, 5000);

            case "default":
                return browser;

            default:
                throw new Error("Incorrect profile name: " + name);

        }

    }

    /**
     *
     * @param browser {Browser}
     * @param height {number}
     * @return {Browser}
     */
    static createDefault(browser, height) {
        browser = Object.assign(new Browser(), browser);

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


class BrowserMutator {


    /**
     * @param browser {Browser}
     */
    constructor(browser) {
        this.browser = Object.assign({}, browser);
    }

    /**
     * @param height {number}
     * @return {BrowserMutator}
     */
    setHeight(height) {

        this.browser.deviceEmulation.screenSize.height = height;
        this.browser.deviceEmulation.viewSize.height = height;

        return this;

    }

    /**
     * @param show {boolean}
     * @return {BrowserMutator}
     */
    setShow(show) {

        this.browser.show = show;

        return this;

    }

    /**
     * @param offscreen {boolean}
     * @return {BrowserMutator}
     */
    setOffscreen(offscreen) {

        this.browser.offscreen = true;

        return this;

    }

    build() {
        return this.browser;
    }

}

module.exports.Browsers = Browsers;
