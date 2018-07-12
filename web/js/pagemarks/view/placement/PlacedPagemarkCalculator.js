const {Preconditions} = require("../../../Preconditions");
const {Line} = require("../../../util/Line");
const {Rects} = require("../../../Rects");
const {PlacedPagemark} = require("./PlacedPagemark");
const {PagemarkRects} = require("../../../metadata/PagemarkRects");

class PlacedPagemarkCalculator {

    /**
     * Compute a Rect for rendering the pagemarkRect onto the parentRect.
     *
     * @param parentRect {Rect}
     * @param pagemark {Pagemark}
     * @return {PlacedPagemark}
     */
    calculate(parentRect, pagemark) {

        let pagemarkRect = pagemark.rect;

        if(! pagemarkRect) {
            pagemarkRect = PagemarkRects.createDefault(pagemark);
        }

        Preconditions.assertNotNull(parentRect, "parentRect");
        Preconditions.assertNotNull(pagemarkRect, "pagemarkRect");

        let fractionalRect = pagemarkRect.toFractionalRect();

        let resultX = this._scaleAxis(parentRect, fractionalRect, "x");
        let resultY = this._scaleAxis(parentRect, fractionalRect, "y");

        let rect = Rects.createFromLines(resultX, resultY);

        return new PlacedPagemark({rect});

    }

    /**
     *
     * @param parentRect {Rect}
     * @param fractionalRect {Rect}
     * @param axis {string}
     * @private
     * @return {Line}
     */
    _scaleAxis(parentRect, fractionalRect, axis) {
        return this._scaleLine(parentRect.toLine(axis), fractionalRect.toLine(axis))
    }

    /**
     *
     * @param parentLine
     * @param fractionalLine
     * @return {Line}
     * @private
     */
    _scaleLine(parentLine, fractionalLine) {
        let start = parentLine.start * fractionalLine.start;
        let end = parentLine.end * fractionalLine.end;
        return new Line(start, end, parentLine.axis);
    }

}

module.exports.PlacedPagemarkCalculator = PlacedPagemarkCalculator;
