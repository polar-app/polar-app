
class BrowserWindows {

    static toBrowserWindowOptions(browser) {

        return {
            minWidth: browser.deviceEmulation.screenSize.width,
            minHeight: browser.deviceEmulation.screenSize.height,
            width: browser.deviceEmulation.screenSize.width,
            height: browser.deviceEmulation.screenSize.height,
            //maxWidth: WIDTH,
            //maxHeight: HEIGHT,
            show: browser.show,

            webPreferences: {
                nodeIntegration: false,
                defaultEncoding: 'UTF-8',
                webaudio: false,
                offscreen: browser.offscreen,

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

}

module.exports.BrowserWindows = BrowserWindows;
