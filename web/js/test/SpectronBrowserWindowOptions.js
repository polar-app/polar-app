"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectronBrowserWindowOptions = void 0;
const process_1 = __importDefault(require("process"));
const SPECTRON_SHOW = 'SPECTRON_SHOW';
const offscreen = process_1.default.env.SPECTRON_OFFSCREEN === 'true';
const show = !offscreen;
console.log("Running with spectron config: ", { offscreen, show });
class SpectronBrowserWindowOptions {
    static create() {
        return {
            backgroundColor: '#FFF',
            show,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                partition: "persist:spectron",
                webviewTag: true,
                offscreen
            }
        };
    }
}
exports.SpectronBrowserWindowOptions = SpectronBrowserWindowOptions;
//# sourceMappingURL=SpectronBrowserWindowOptions.js.map