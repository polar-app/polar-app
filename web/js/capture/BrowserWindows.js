class BrowserWindows {

    static toBrowserWindowOptions(browser) {

        return {
            minWidth: browser.deviceEmulation.screenSize.width,
            minHeight: browser.deviceEmulation.screenSize.height,
            width: browser.deviceEmulation.screenSize.width,
            height: browser.deviceEmulation.screenSize.height,
            //maxWidth: WIDTH,
            //maxHeight: HEIGHT,
            //show: false,
            webPreferences: {
                nodeIntegration: false,
                defaultEncoding: 'UTF-8',
                webaudio: false
            }

        }

    }

};

module.exports.BrowserWindows = BrowserWindows;
