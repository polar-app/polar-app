"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotDelegate = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Stopwatches_1 = require("polar-shared/src/util/Stopwatches");
const log = Logger_1.Logger.create();
class ScreenshotDelegate {
    capture(id, screenshotRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeImage = yield Stopwatches_1.Stopwatches.withStopwatchAsync(() => this.captureNativeImage(id, screenshotRequest), stopwatch => log.debug("captureNativeImage took: " + stopwatch));
            return Stopwatches_1.Stopwatches.withStopwatch(() => this.toCapturedScreenshot(nativeImage, screenshotRequest), stopwatch => log.debug("toCapturedScreenshot took: " + stopwatch));
        });
    }
    captureNativeImage(id, screenshotRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const webContentsInstance = electron_1.webContents.fromId(id);
            if (!screenshotRequest) {
                throw new Error("screenshotRequest required");
            }
            let rect = screenshotRequest.rect;
            if (!rect) {
                throw new Error("No rect");
            }
            rect = {
                x: Math.round(screenshotRequest.rect.x),
                y: Math.round(screenshotRequest.rect.y),
                width: Math.round(screenshotRequest.rect.width),
                height: Math.round(screenshotRequest.rect.height)
            };
            let image = yield webContentsInstance.capturePage(rect);
            if (screenshotRequest.resize) {
                if (screenshotRequest.resize.width !== undefined ||
                    screenshotRequest.resize.height !== undefined) {
                    log.info("Resizing image to: ", screenshotRequest.resize);
                    image = image.resize(screenshotRequest.resize);
                }
            }
            if (screenshotRequest.crop) {
                log.info("Cropping image to: ", screenshotRequest.resize);
                image = image.crop(screenshotRequest.crop);
            }
            return image;
        });
    }
    toCapturedScreenshot(image, screenshotRequest) {
        const toData = () => {
            switch (screenshotRequest.type) {
                case 'data-url':
                    return image.toDataURL();
                case 'png':
                    return image.toPNG();
            }
        };
        const data = toData();
        const size = image.getSize();
        const capturedScreenshot = {
            data,
            dimensions: {
                width: size.width,
                height: size.height
            },
            type: screenshotRequest.type
        };
        return capturedScreenshot;
    }
}
exports.ScreenshotDelegate = ScreenshotDelegate;
ScreenshotDelegate.DELEGATE_NAME = "screenshotDelegate";
//# sourceMappingURL=ScreenshotDelegate.js.map