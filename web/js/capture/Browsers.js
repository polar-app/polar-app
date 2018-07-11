
const {Objects} = require("../util/Objects");

/**
 * The page height we should use when loading the document.  It might make
 * sense in the future to just set this to document.body.scrollHeight after
 * the page loads.  In fact this will definitely need to be changed.  Some
 * javascript and CSS can display things at the bottom of the window so it
 * could make the captured page look massive.
 *
 * @type {number}
 */
const HEADLESS_HEIGHT = 35000;

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

            case "headless":

                browser = Objects.duplicate(browser);

                browser.deviceEmulation.screenSize.height = HEADLESS_HEIGHT;
                browser.deviceEmulation.viewSize.height = HEADLESS_HEIGHT;

                browser.show = false;
                browser.offscreen = true;

                return browser;

            case "default":
                return browser;

            default:
                throw new Error("Incorrect profile name: " + name);

        }

    }

}

module.exports.Browsers = Browsers;
