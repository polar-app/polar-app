"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Browser_1 = require("./Browser");
class Browsers {
    static toProfile(browser, name) {
        switch (name) {
            case "hidden":
                return new Browser_1.BrowserBuilder(browser)
                    .setHeight(35000)
                    .setShow(false)
                    .build();
            case "headless":
                return new Browser_1.BrowserBuilder(browser)
                    .setHeight(35000)
                    .setShow(true)
                    .setOffscreen(true)
                    .build();
            case "headless_500":
                return new Browser_1.BrowserBuilder(browser)
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
    static createDefault(browser, height) {
        browser = Object.assign({}, browser);
        browser.deviceEmulation.screenSize.height = height;
        browser.deviceEmulation.viewSize.height = height;
        return browser;
    }
}
exports.Browsers = Browsers;
//# sourceMappingURL=Browsers.js.map