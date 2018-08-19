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
const electron_1 = require("electron");
class ScreenshotService {
    constructor() {
    }
    start() {
        electron_1.ipcMain.on('create-screenshot', (event, screenshotRequest) => __awaiter(this, void 0, void 0, function* () {
            let webContents = electron_1.BrowserWindow.getFocusedWindow().webContents;
            let image = yield ScreenshotService.capture(webContents, screenshotRequest);
            let dataURL = image.toDataURL();
            let size = image.getSize();
            let screenshotResult = {
                dataURL,
                dimensions: {
                    width: size.width,
                    height: size.height
                }
            };
            event.sender.send("screenshot-created", screenshotResult);
        }));
    }
    static capture(webContents, screenshotRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!screenshotRequest) {
                throw new Error("screenshotRequest required");
            }
            let rect = screenshotRequest.rect;
            if (!rect) {
                throw new Error("No rect");
            }
            return new Promise((resolve) => {
                webContents.capturePage(rect, (image) => {
                    resolve(image);
                });
            });
        });
    }
}
exports.ScreenshotService = ScreenshotService;
//# sourceMappingURL=ScreenshotService.js.map