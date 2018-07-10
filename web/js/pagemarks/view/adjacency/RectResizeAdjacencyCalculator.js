const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {Line} = require("../../../util/Line");
const {Preconditions} = require("../../../Preconditions");

class RectResizeAdjacencyCalculator {

    /**
     *
     * @param resizeRect {Rect} The Rect that the user is resizing and hasn't
     * been accepted yet.
     *
     * @param intersectedRect {Rect} The rect we've intersected with.
     *
     * @param rectEdges {RectEdges} The rectEdges that are being resized.
     *
     */
    calculate(resizeRect, intersectedRect, rectEdges) {

        Preconditions.assertNotNull(rectEdges, "rectEdges");

        // compute the intersection of the two rects.
        let intersectionRect = Rects.intersection(resizeRect, intersectedRect);

        // we could call toLine() on each one and specify an 'axis' parameter
        // which would be much cleaner.

        // only adjust ONE dimension... the most important.

        // TODO: we can refactor this to pass __adjustLine the axis and then call
        // toLine(axis) on each rect inside _adjustRect.

        if(intersectionRect.width > intersectionRect.height) {
            return this.__adjustLine(intersectionRect.verticalLine(), resizeRect.verticalLine(), rectEdges.toLineEdges("y"), resizeRect);
        } else {
            return this.__adjustLine(intersectionRect.horizontalLine(), resizeRect.horizontalLine(), rectEdges.toLineEdges("x"), resizeRect);
        }

    }

    /**
     *
     * @param intersectionLine {Line}
     * @param resizeLine {Line}
     * @param resizeRect {Rect}
     * @param lineEdges {LineEdges}
     * @private
     * @return {Rect}
     */
    __adjustLine(intersectionLine, resizeLine, lineEdges, resizeRect) {

        // the rect that we are going to adjust and then use in the UI.
        let adjustedRect = new Rect(resizeRect);

        let adjustedLine = Objects.duplicate(resizeLine);

        if(lineEdges.start) {
            adjustedLine.start = intersectionLine.end;
        } else {
            adjustedLine.end = intersectionLine.start;
        }

        // // only update the lines that are intersected...
        // if (intersectionLine.containsPoint(resizeLine.start)) {
        //     adjustedLine.start = intersectionLine.end;
        // }
        //
        // if (intersectionLine.containsPoint(resizeLine.end)) {
        //     adjustedLine.end = intersectionLine.start;
        // }

        // technically we have to adjust the width of the line but the width
        // accessor on Line computes it for us.

        return adjustedRect.adjustAxis(adjustedLine);

    }


}

module.exports.RectResizeAdjacencyCalculator = RectResizeAdjacencyCalculator;
