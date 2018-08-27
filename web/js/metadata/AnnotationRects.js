"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../logger/Logger");
const Preconditions_1 = require("../Preconditions");
const Rect_1 = require("../Rect");
const AnnotationRect_1 = require("./AnnotationRect");
const { Rects } = require("../Rects");
const log = Logger_1.Logger.create();
class AnnotationRects {
    static createFromEvent(contextMenuLocation) {
        let points = contextMenuLocation.points;
        let elements = document.elementsFromPoint(points.client.x, points.client.y);
        elements = elements.filter(element => element.matches(".page"));
        if (elements.length === 1) {
            let pageElement = elements[0];
            log.info("Creating box on pageElement: ", pageElement);
            let pageElementPoint = points.pageOffset;
            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });
            log.info("Placing box at: ", boxRect);
            let containerRect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: pageElement.offsetWidth,
                height: pageElement.offsetHeight
            });
            return AnnotationRects.createFromPositionedRect(boxRect, containerRect);
        }
        throw new Error("Wrong number of .page elements: " + elements.length);
    }
    static createFromPositionedRect(boxRect, containerRect) {
        Preconditions_1.Preconditions.assertInstanceOf(boxRect, Rect_1.Rect, "boxRect");
        let xAxis = boxRect.toLine("x").multiply(100 / containerRect.width);
        let yAxis = boxRect.toLine("y").multiply(100 / containerRect.height);
        return AnnotationRects.createFromLines(xAxis, yAxis);
    }
    static createFromLines(xAxis, yAxis) {
        return AnnotationRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }
    static createFromRect(rect) {
        return new AnnotationRect_1.AnnotationRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });
    }
}
exports.AnnotationRects = AnnotationRects;
//# sourceMappingURL=AnnotationRects.js.map