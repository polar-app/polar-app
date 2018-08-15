"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagemarkType_1 = require("./PagemarkType");
const PagemarkRect_1 = require("./PagemarkRect");
const Preconditions_1 = require("../Preconditions");
const { Rect } = require("../Rect");
const { Rects } = require("../Rects");
class PagemarkRects {
    static createDefault(pagemark) {
        if (pagemark.type === PagemarkType_1.PagemarkType.SINGLE_COLUMN && "percentage" in pagemark) {
            return new PagemarkRect_1.PagemarkRect({
                left: 0,
                top: 0,
                width: 100,
                height: pagemark.percentage
            });
        }
        throw new Error("Can not create default");
    }
    static createFromPercentage(percentage) {
        return new PagemarkRect_1.PagemarkRect({
            left: 0,
            top: 0,
            width: 100,
            height: percentage
        });
    }
    static createFromRect(rect) {
        return new PagemarkRect_1.PagemarkRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });
    }
    static createFromLines(xAxis, yAxis) {
        return PagemarkRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }
    static createFromPositionedRect(boxRect, containerRect) {
        Preconditions_1.Preconditions.assertInstanceOf(boxRect, Rect, "boxRect");
        let xAxis = boxRect.toLine("x").multiply(100 / containerRect.width);
        let yAxis = boxRect.toLine("y").multiply(100 / containerRect.height);
        return this.createFromLines(xAxis, yAxis);
    }
}
exports.PagemarkRects = PagemarkRects;
//# sourceMappingURL=PagemarkRects.js.map