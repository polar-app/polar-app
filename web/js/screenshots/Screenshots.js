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
exports.Screenshots = void 0;
const ElectronScreenshots_1 = require("./electron/ElectronScreenshots");
const Buffers_1 = require("polar-shared/src/util/Buffers");
const Canvases_1 = require("polar-shared/src/util/Canvases");
const Logger_1 = require("polar-shared/src/logger/Logger");
const BrowserScreenshots_1 = require("./browser/BrowserScreenshots");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
var Screenshots;
(function (Screenshots) {
    function capture(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNum, boxRect, element, fileType } = opts;
            Preconditions_1.Preconditions.assertPresent(fileType, 'fileType');
            const captureDirectly = () => {
                return captureViaBrowser(boxRect, element);
            };
            switch (fileType) {
                case 'pdf':
                    return captureViaCanvas(pageNum, boxRect);
                case 'epub':
                    return captureDirectly();
            }
        });
    }
    Screenshots.capture = capture;
    function captureViaElectron(rect, element) {
        return __awaiter(this, void 0, void 0, function* () {
            log.debug("Capturing via electron");
            rect = computeCaptureRect(rect, element);
            const { width, height } = rect;
            const target = {
                x: rect.left,
                y: rect.top,
                width,
                height
            };
            const capturedScreenshot = yield ElectronScreenshots_1.ElectronScreenshots.capture(target, { type: 'png' });
            const buffer = capturedScreenshot.data;
            const data = Buffers_1.Buffers.toArrayBuffer(buffer);
            return { data, type: 'image/png', width, height };
        });
    }
    function captureViaCanvas(pageNum, rect) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Capturing via canvas");
            function getPageElementForPage(pageNum) {
                const pages = document.querySelectorAll(".page");
                return pages[pageNum - 1];
            }
            function getCanvasForPage(pageNum) {
                const pageElement = getPageElementForPage(pageNum);
                const canvas = pageElement.querySelector("canvas");
                if (!canvas) {
                    throw new Error("Could not find canvas for page: " + pageNum);
                }
                return canvas;
            }
            const canvas = getCanvasForPage(pageNum);
            return yield Canvases_1.Canvases.extract(canvas, rect);
        });
    }
    function captureViaBrowser(boxRect, element) {
        return __awaiter(this, void 0, void 0, function* () {
            const browserScreenshot = yield BrowserScreenshots_1.BrowserScreenshots.capture(boxRect, element);
            if (browserScreenshot) {
                return {
                    data: browserScreenshot.dataURL,
                    type: browserScreenshot.type,
                    width: boxRect.width,
                    height: boxRect.height
                };
            }
            else {
                throw new Error("Unable to take screenshot via browser");
            }
        });
    }
    function computeCaptureRect(rect, element) {
        if (element) {
            const { width, height } = rect;
            const boundingClientRect = element.getBoundingClientRect();
            return {
                left: boundingClientRect.left,
                top: boundingClientRect.top,
                width, height
            };
        }
        return rect;
    }
    Screenshots.computeCaptureRect = computeCaptureRect;
})(Screenshots = exports.Screenshots || (exports.Screenshots = {}));
//# sourceMappingURL=Screenshots.js.map