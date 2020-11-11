"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
const ScreenshotDelegate_1 = require("./ScreenshotDelegate");
class ScreenshotService {
    start() {
        const screenshotDelegate = new ScreenshotDelegate_1.ScreenshotDelegate();
        if (global[ScreenshotDelegate_1.ScreenshotDelegate.DELEGATE_NAME]) {
            throw new Error("Object named screenshotDelegate already in global");
        }
        global[ScreenshotDelegate_1.ScreenshotDelegate.DELEGATE_NAME] = screenshotDelegate;
    }
}
exports.ScreenshotService = ScreenshotService;
//# sourceMappingURL=ScreenshotService.js.map