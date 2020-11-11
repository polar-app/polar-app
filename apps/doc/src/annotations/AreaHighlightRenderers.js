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
exports.AreaHighlightRenderers = void 0;
const AnnotationRects_1 = require("../../../../web/js/metadata/AnnotationRects");
const AreaHighlights_1 = require("../../../../web/js/metadata/AreaHighlights");
const Screenshots_1 = require("../../../../web/js/screenshots/Screenshots");
const Preconditions_1 = require("polar-shared/src/Preconditions");
var AreaHighlightRenderers;
(function (AreaHighlightRenderers) {
    var getPageElementDimensions = AnnotationRects_1.AnnotationRects.getPageElementDimensions;
    function createAreaHighlightFromEvent(pageNum, pointWithinPageElement, docScale, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(fileType, 'fileType');
            const rect = AnnotationRects_1.AnnotationRects.createFromPointWithinPageElement(pageNum, pointWithinPageElement);
            const pageDimensions = getPageElementDimensions(pageNum);
            if (!pageDimensions) {
                throw new Error("No page dimensions");
            }
            const overlayRect = rect.toDimensions(pageDimensions);
            const positionRect = AreaHighlights_1.AreaHighlights.toCorrectScale2(overlayRect, docScale.scaleValue);
            const position = {
                x: positionRect.left,
                y: positionRect.top,
                width: positionRect.width,
                height: positionRect.height,
            };
            const capturedScreenshot = yield Screenshots_1.Screenshots.capture({ pageNum, boxRect: overlayRect, fileType });
            Preconditions_1.Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot');
            const areaHighlight = AreaHighlights_1.AreaHighlights.create({ rect });
            return { capturedScreenshot, areaHighlight, position };
        });
    }
    AreaHighlightRenderers.createAreaHighlightFromEvent = createAreaHighlightFromEvent;
    function createAreaHighlightFromOverlayRect(pageNum, overlayRect, docScale, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(fileType, 'fileType');
            const rect = AnnotationRects_1.AnnotationRects.createFromOverlayRect(pageNum, overlayRect);
            const pageDimensions = getPageElementDimensions(pageNum);
            if (!pageDimensions) {
                throw new Error("No page dimensions");
            }
            const positionRect = AreaHighlights_1.AreaHighlights.toCorrectScale2(overlayRect, docScale.scaleValue);
            const position = {
                x: positionRect.left,
                y: positionRect.top,
                width: positionRect.width,
                height: positionRect.height,
            };
            const capturedScreenshot = yield Screenshots_1.Screenshots.capture({ pageNum, boxRect: overlayRect, fileType });
            const areaHighlight = AreaHighlights_1.AreaHighlights.create({ rect });
            return { capturedScreenshot, areaHighlight, position };
        });
    }
    AreaHighlightRenderers.createAreaHighlightFromOverlayRect = createAreaHighlightFromOverlayRect;
})(AreaHighlightRenderers = exports.AreaHighlightRenderers || (exports.AreaHighlightRenderers = {}));
//# sourceMappingURL=AreaHighlightRenderers.js.map