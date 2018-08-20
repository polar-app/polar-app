"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppPaths_1 = require("../electron/webresource/AppPaths");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
class BrowserWindows {
    static toBrowserWindowOptions(browserProfile) {
        let partition = "part-" + Date.now();
        let preload = AppPaths_1.AppPaths.relative("./web/js/capture/renderer/ContentCapture.js");
        log.info("Loading with preload: ", preload);
        return {
            minWidth: browserProfile.deviceEmulation.screenSize.width,
            minHeight: browserProfile.deviceEmulation.screenSize.height,
            width: browserProfile.deviceEmulation.screenSize.width,
            height: browserProfile.deviceEmulation.screenSize.height,
            show: browserProfile.show,
            enableLargerThanScreen: true,
            webPreferences: {
                preload,
                nodeIntegration: false,
                defaultEncoding: 'UTF-8',
                webaudio: false,
                offscreen: browserProfile.offscreen,
                webSecurity: false,
                partition: partition
            }
        };
    }
    static onceReadyToShow(window) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                window.once('ready-to-show', () => {
                    return resolve(window);
                });
            });
        });
    }
}
exports.BrowserWindows = BrowserWindows;
//# sourceMappingURL=BrowserWindows.js.map