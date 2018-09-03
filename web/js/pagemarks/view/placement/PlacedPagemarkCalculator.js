"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagemarkRects_1 = require("../../../metadata/PagemarkRects");
const Preconditions_1 = require("../../../Preconditions");
const Rects_1 = require("../../../Rects");
const PlacedPagemark_1 = require("./PlacedPagemark");
const Line_1 = require("../../../util/Line");
class PlacedPagemarkCalculator {
    calculate(parentRect, pagemark) {
        let pagemarkRect = pagemark.rect;
        if (!pagemarkRect) {
            pagemarkRect = PagemarkRects_1.PagemarkRects.createDefault(pagemark);
        }
        Preconditions_1.Preconditions.assertNotNull(parentRect, "parentRect");
        Preconditions_1.Preconditions.assertNotNull(pagemarkRect, "pagemarkRect");
        let fractionalRect = pagemarkRect.toFractionalRect();
        let resultX = this._scaleAxis(parentRect, fractionalRect, "x");
        let resultY = this._scaleAxis(parentRect, fractionalRect, "y");
        let rect = Rects_1.Rects.createFromLines(resultX, resultY);
        return new PlacedPagemark_1.PlacedPagemark({ rect });
    }
    _scaleAxis(parentRect, fractionalRect, axis) {
        return this._scaleLine(parentRect.toLine(axis), fractionalRect.toLine(axis));
    }
    _scaleLine(parentLine, fractionalLine) {
        let start = parentLine.start * fractionalLine.start;
        let end = parentLine.end * fractionalLine.end;
        return new Line_1.Line(start, end, parentLine.axis);
    }
}
exports.PlacedPagemarkCalculator = PlacedPagemarkCalculator;
//# sourceMappingURL=PlacedPagemarkCalculator.js.map