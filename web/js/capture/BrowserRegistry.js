"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Browser_1 = require("./Browser");
let BrowserRegistry = {
    MOBILE_GALAXY_S8: {
        name: "MOBILE_GALAXY_S8",
        description: "Galaxy S8 mobile device (stock)",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            },
            viewPosition: { x: 0, y: 0 },
            deviceScaleFactor: 0,
            scale: 1
        }
    },
    MOBILE_GALAXY_S8_WITH_CHROME_61: new Browser_1.Browser({
        name: "MOBILE_GALAXY_S8_WITH_CHROME_61",
        description: "Galaxy S8 mobile device but with Chrome 61 (same version as Electron)",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            }
        }
    }),
    MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750: new Browser_1.Browser({
        name: "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
        description: "Galaxy S8 mobile device running Chrome 61 but with width at 750",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 750,
                height: 970
            },
            viewSize: {
                width: 750,
                height: 970
            }
        }
    }),
    MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_700: new Browser_1.Browser({
        name: "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_700",
        description: "Galaxy S8 mobile device running Chrome 61 but with width at 700",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 700,
                height: 905
            },
            viewSize: {
                width: 700,
                height: 905
            }
        }
    }),
    CHROME_61: new Browser_1.Browser({
        name: "CHROME_61",
        description: "Default Chrome 61",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 1024,
                height: 768
            },
            viewSize: {
                width: 1024,
                height: 786
            }
        }
    })
};
BrowserRegistry.DEFAULT = BrowserRegistry.CHROME_61;
exports.default = BrowserRegistry;
//# sourceMappingURL=BrowserRegistry.js.map