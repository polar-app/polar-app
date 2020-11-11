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
exports.ElectronScreenshots = void 0;
const IXYRects_1 = require("polar-shared/src/util/rects/IXYRects");
const Screenshot_1 = require("../Screenshot");
const ClientRects_1 = require("polar-shared/src/util/rects/ClientRects");
const Logger_1 = require("polar-shared/src/logger/Logger");
const ScreenshotDelegate_1 = require("./ScreenshotDelegate");
const electron_1 = require("electron");
const Promises_1 = require("../../util/Promises");
const AnnotationToggler_1 = require("../AnnotationToggler");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const log = Logger_1.Logger.create();
const MIN_PAINT_INTERVAL = 1000 / 60;
class ElectronScreenshots {
    static supported() {
        return AppRuntime_1.AppRuntime.isElectron();
    }
    static capture(target, opts = new Screenshot_1.DefaultCaptureOpts()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.supported()) {
                throw new Error("Captured screenshots not supported");
            }
            const screenshotRequest = yield this.doCapture(target, opts);
            log.info("Sending screenshot request: ", screenshotRequest);
            const id = this.getWebContentsID();
            const annotationToggler = new AnnotationToggler_1.AnnotationToggler();
            yield annotationToggler.hide();
            const capturedScreenshot = yield this.getRemoteDelegate().capture(id, screenshotRequest);
            yield Promises_1.Promises.requestAnimationFrame(() => annotationToggler.show());
            return capturedScreenshot;
        });
    }
    static captureToFile(target, dest, opts) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static getRemoteDelegate() {
        return electron_1.remote.getGlobal(ScreenshotDelegate_1.ScreenshotDelegate.DELEGATE_NAME);
    }
    static getWebContentsID() {
        return electron_1.remote.getCurrentWebContents().id;
    }
    static doCapture(target, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let rect;
            if (target instanceof HTMLElement) {
                log.info("Using HTML element to build rect from bounding client rect.");
                rect = IXYRects_1.IXYRects.createFromClientRect(target.getBoundingClientRect());
            }
            else if (ClientRects_1.ClientRects.instanceOf(target)) {
                rect = {
                    x: target.left,
                    y: target.top,
                    width: target.width,
                    height: target.height
                };
                log.info("Using client rect: ", rect);
            }
            else if (IXYRects_1.IXYRects.instanceOf(target)) {
                log.info("Using IXYRect");
                rect = target;
            }
            else {
                throw new Error("Unknown target type.");
            }
            const screenshotRequest = {
                rect,
                resize: opts.resize,
                crop: opts.crop,
                type: opts.type
            };
            return screenshotRequest;
        });
    }
}
exports.ElectronScreenshots = ElectronScreenshots;
//# sourceMappingURL=ElectronScreenshots.js.map