const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {Line} = require("../../../util/Line");

class RectResizeAdjacencyCalculator {

    /**
     *
     * @param resizeRect {Rect} The Rect that the user is resizing and hasn't
     * been accepted yet.
     *
     * @param intersectedRect {Rect} The rect we've intersected with.
     *
     */
    calculate(resizeRect, intersectedRect) {

        let intersectionRect = Rects.intersection(resizeRect, intersectedRect);

        // the rect that we are going to adjust and then use in the UI.
        let adjustedRect = new Rect(resizeRect);

        // only adjust ONE dimension...
        if(intersectionRect.width > intersectionRect.height) {

            let adjustedLine = this.__adjustLine(intersectionRect.verticalLine(), resizeRect.verticalLine());
            adjustedRect.adjustVertical(adjustedLine);

        } else {

            let adjustedLine = this.__adjustLine(intersectionRect.horizontalLine(), resizeRect.horizontalLine());
            adjustedRect.adjustHorizontal(adjustedLine);

        }

        return adjustedRect;

    }

    /**
     *
     * @param intersectionLine {Line}
     * @param resizeLine {Line}
     * @private
     * @return {Line}
     */
    __adjustLine(intersectionLine, resizeLine) {

        let adjustLine = Objects.duplicate(resizeLine);

        // only update the lines that are intersected...
        if (intersectionLine.containsPoint(resizeLine.start)) {
            adjustLine.start = intersectionLine.end;
        }

        if (intersectionLine.containsPoint(resizeLine.end)) {
            adjustLine.end = intersectionLine.start;
        }

        // technically we have to adjust the width of the line but the width'
        // accessor on Line computes it for us.

        return adjustLine;

    }


}

module.exports.RectResizeAdjacencyCalculator = RectResizeAdjacencyCalculator;
