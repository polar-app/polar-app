"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRects = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Rect_1 = require("../Rect");
const AnnotationRect_1 = require("./AnnotationRect");
const Rects_1 = require("../Rects");
var AnnotationRects;
(function (AnnotationRects) {
    function computeContainerDimensions(element) {
        return {
            width: element.clientWidth,
            height: element.clientHeight
        };
    }
    AnnotationRects.computeContainerDimensions = computeContainerDimensions;
    function getPageElementAtPoint(point) {
        const elements = document.elementsFromPoint(point.x, point.y)
            .filter(element => element.matches(".page"));
        if (elements.length === 1) {
            return elements[0];
        }
        return undefined;
    }
    AnnotationRects.getPageElementAtPoint = getPageElementAtPoint;
    function getPageElement(page) {
        return document.querySelectorAll(".page")[page - 1] || undefined;
    }
    AnnotationRects.getPageElement = getPageElement;
    function getPageElementDimensions(page) {
        const pageElement = getPageElement(page);
        if (!pageElement) {
            return undefined;
        }
        return computeContainerDimensions(pageElement);
    }
    AnnotationRects.getPageElementDimensions = getPageElementDimensions;
    function createFromPointWithinPageElement(pageNum, pointWithinPageElement) {
        const pageElement = getPageElement(pageNum);
        if (pageElement) {
            const containerDimensions = computeContainerDimensions(pageElement);
            return createFromPointWithinPageAndContainer(pointWithinPageElement, containerDimensions);
        }
        throw new Error("No page found at point");
    }
    AnnotationRects.createFromPointWithinPageElement = createFromPointWithinPageElement;
    function createFromOverlayRect(pageNum, overlayRect) {
        const pageElement = getPageElement(pageNum);
        if (pageElement) {
            const containerDimensions = computeContainerDimensions(pageElement);
            return createFromOverlayRectWithinPageAndContainer(overlayRect, containerDimensions);
        }
        throw new Error("No page found at point");
    }
    AnnotationRects.createFromOverlayRect = createFromOverlayRect;
    function createFromPointWithinPageAndContainer(pointWithinPageElement, containerDimensions) {
        const boxRect = Rects_1.Rects.createFromBasicRect({
            left: pointWithinPageElement.x,
            top: pointWithinPageElement.y,
            width: 150,
            height: 150
        });
        return createFromOverlayRectWithinPageAndContainer(boxRect, containerDimensions);
    }
    AnnotationRects.createFromPointWithinPageAndContainer = createFromPointWithinPageAndContainer;
    function createFromOverlayRectWithinPageAndContainer(overlayRect, containerDimensions) {
        return AnnotationRects.createFromPositionedRect(Rects_1.Rects.createFromBasicRect(overlayRect), containerDimensions);
    }
    AnnotationRects.createFromOverlayRectWithinPageAndContainer = createFromOverlayRectWithinPageAndContainer;
    function createFromPositionedRect(boxRect, containerDimensions) {
        Preconditions_1.Preconditions.assertCondition(boxRect.width > 0, 'boxRect width');
        Preconditions_1.Preconditions.assertCondition(boxRect.height > 0, 'boxRect height');
        Preconditions_1.Preconditions.assertCondition(containerDimensions.width > 0, 'containerRect width');
        Preconditions_1.Preconditions.assertCondition(containerDimensions.height > 0, 'containerRect height');
        Preconditions_1.Preconditions.assertInstanceOf(boxRect, Rect_1.Rect, "boxRect");
        const xAxis = boxRect.toLine("x").multiply(100 / containerDimensions.width);
        const yAxis = boxRect.toLine("y").multiply(100 / containerDimensions.height);
        return AnnotationRects.createFromLines(xAxis, yAxis);
    }
    AnnotationRects.createFromPositionedRect = createFromPositionedRect;
    function createFromLines(xAxis, yAxis) {
        return AnnotationRects.createFromRect(Rects_1.Rects.createFromLines(xAxis, yAxis));
    }
    AnnotationRects.createFromLines = createFromLines;
    function createFromRect(rect) {
        return new AnnotationRect_1.AnnotationRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });
    }
    AnnotationRects.createFromRect = createFromRect;
})(AnnotationRects = exports.AnnotationRects || (exports.AnnotationRects = {}));
//# sourceMappingURL=AnnotationRects.js.map