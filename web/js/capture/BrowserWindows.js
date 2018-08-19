"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppPaths_1 = require("../electron/webresource/AppPaths");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
class BrowserWindows {
    static toBrowserWindowOptions(browser) {
        let partition = "part-" + Date.now();
        let preload = AppPaths_1.AppPaths.relative("./web/js/capture/renderer/ContentCapture.js");
        log.info("Loading with preload: ", preload);
        return {
            minWidth: browser.deviceEmulation.screenSize.width,
            minHeight: browser.deviceEmulation.screenSize.height,
            width: browser.deviceEmulation.screenSize.width,
            height: browser.deviceEmulation.screenSize.height,
            show: browser.show,
            enableLargerThanScreen: true,
            webPreferences: {
                preload,
                nodeIntegration: false,
                defaultEncoding: 'UTF-8',
                webaudio: false,
                offscreen: browser.offscreen,
                webSecurity: false,
                partition: partition
            }
        };
    }
}
exports.BrowserWindows = BrowserWindows;
//# sourceMappingURL=BrowserWindows.js.map