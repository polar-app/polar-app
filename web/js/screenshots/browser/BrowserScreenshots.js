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
exports.BrowserScreenshots = void 0;
const WebExtensions_1 = require("polar-web-extension-api/src/WebExtensions");
const Results_1 = require("polar-shared/src/util/Results");
const Canvases_1 = require("polar-shared/src/util/Canvases");
const AnnotationToggler_1 = require("../AnnotationToggler");
const Screenshots_1 = require("../Screenshots");
class BrowserScreenshots {
    static capture(rect, element) {
        return __awaiter(this, void 0, void 0, function* () {
            rect = Screenshots_1.Screenshots.computeCaptureRect(rect, element);
            if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
                const captureWithRemoteCrop = () => __awaiter(this, void 0, void 0, function* () {
                    const request = {
                        type: 'browser-screenshot',
                        rect
                    };
                    const response = yield WebExtensions_1.WebExtensions.Messaging.sendMessage(request);
                    if (!response) {
                        throw new Error("No response from web extension");
                    }
                    const result = Results_1.Results.create(response);
                    return result.get();
                });
                const captureWithLocalCrop = () => __awaiter(this, void 0, void 0, function* () {
                    const annotationToggler = new AnnotationToggler_1.AnnotationToggler();
                    try {
                        yield annotationToggler.hide();
                        const request = {
                            type: 'browser-screenshot',
                        };
                        const response = yield WebExtensions_1.WebExtensions.Messaging.sendMessage(request);
                        if (!response) {
                            throw new Error("No response from web extension");
                        }
                        const result = Results_1.Results.create(response);
                        const uncropped = result.get();
                        const croppedImage = yield Canvases_1.Canvases.crop(uncropped.dataURL, rect);
                        return {
                            type: uncropped.type,
                            dataURL: croppedImage
                        };
                    }
                    catch (e) {
                        throw e;
                    }
                    finally {
                        annotationToggler.show();
                    }
                });
                return yield captureWithLocalCrop();
            }
            else {
                throw new Error("No web extension support");
            }
        });
    }
}
exports.BrowserScreenshots = BrowserScreenshots;
//# sourceMappingURL=BrowserScreenshots.js.map