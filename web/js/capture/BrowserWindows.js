const HEADLESS_HEIGHT = 25000;

const {Objects} = require("../util/Objects");

class BrowserWindows {

    static toBrowserWindowOptions(browser) {

        return {
            minWidth: browser.deviceEmulation.screenSize.width,
            minHeight: browser.deviceEmulation.screenSize.height,
            width: browser.deviceEmulation.screenSize.width,
            height: browser.deviceEmulation.screenSize.height,
            //maxWidth: WIDTH,
            //maxHeight: HEIGHT,
            show: true,

            webPreferences: {
                nodeIntegration: false,
                defaultEncoding: 'UTF-8',
                webaudio: false,
                offscreen: false,

                /**
                 * This is needed for now because we have to access the iframe
                 * content from the frame and that might not be possible otherwise.
                 * There is not necessarily anything to steal here yet as we're
                 * not using any type of cookie sharing but we might in the future
                 * so need to be careful here.  As soon as we can get access
                 * to the iframe documents from electron we should move to
                 * a more secure solution.
                 */
                webSecurity: false
            }

        }

    }

    /**
     * Migrate this to a profile of setting we then use to create the browser
     * window options.
     *
     * @param browserWindowOptions
     * @param name {string} The name of the profile to use.
     */
    static toProfile(browserWindowOptions, name) {

        // support offscreen rendering (similar to chrome headless)
        //
        // https://electronjs.org/docs/tutorial/offscreen-rendering

        switch (name) {

            case "headless":

                browserWindowOptions = Objects.duplicate(browserWindowOptions);
                browserWindowOptions.minHeight = HEADLESS_HEIGHT;
                browserWindowOptions.height = HEADLESS_HEIGHT;
                browserWindowOptions.show = false;
                browserWindowOptions.webPreferences.offscreen = true;

                return browserWindowOptions;

            case "default":
                return browserWindowOptions;

            default:
                throw new Error("Incorrect profile name: " + name);

        }

    }

}

module.exports.BrowserWindows = BrowserWindows;
