const path = require("path");

// Investigate this as a way to adjust the screen size automatically:

// useContentSize Boolean (optional) - The width and height would be used as web
// page's size, which means the actual window's size will include window frame's
// size and be slightly larger. Default is false.

class BrowserWindows {

    static toBrowserWindowOptions(browser) {

        let partition = "part-" + new Date().getMilliseconds();

        return {
            minWidth: browser.deviceEmulation.screenSize.width,
            minHeight: browser.deviceEmulation.screenSize.height,
            width: browser.deviceEmulation.screenSize.width,
            height: browser.deviceEmulation.screenSize.height,
            //maxWidth: WIDTH,
            //maxHeight: HEIGHT,
            show: browser.show,

            // Enable the window to be resized larger than screen. Default is false.
            enableLargerThanScreen: true,

            webPreferences: {

                // the path to our content capture bundle needs to be absolute
                // for some strange reason and this is required by Electron.
                preload:  path.resolve("./web/js/capture/renderer/ContentCapture-bundle.js"),

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
                webSecurity: false,

                /**
                 * Use a session per capture so that webRequests between capture
                 * instances aren't shared.
                 */
                partition: partition

            }

        }

    }

}

module.exports.BrowserWindows = BrowserWindows;
