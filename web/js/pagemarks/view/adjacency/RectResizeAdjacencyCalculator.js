const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {Line} = require("../../../util/Line");

class RectResizeAdjacencyCalculator {

    /**
     *
     * @param resizeRect {Rect} The Rect that the user is resizing and hasn't been accepted yet.
     *
     * @param intersectedRect {Rect} The rect we've intersected with.
     *
     */
    static calculate(resizeRect, intersectedRect) {

        // this is still a bit difficult to implement.  my thinking at the
        // time was to figure out which direction the mouse is primarily
        // moving OR where the rect was BEFORE it intersected and then
        // figure out side took up the largest side vs what it's about
        // to collide into.  Either that or compute a derived rect
        // from the intersected rect and then figure out if the height
        // is more than the width and then go with whichever is higher.



        // TODO: take the previous unintersected position, determine
        // if the rect is to the right, left, top , or bottom, and then
        // truncate at THAT position until we select a new one..

        // the intersectionRect is the intersection of the intersectedRect
        // and the resizedRect to determine how we should create the
        // adjustedRect
        let intersectionRect = Rects.intersection(resizeRect, intersectedRect);

        // the rect that we are going to adjust and then use in the UI.
        let adjustedRect = Objects.duplicate(resizeRect);

        // only adjust ONE dimension...
        if(intersectionRect.width > intersectionRect.height) {

            console.log("FIXME adjusting on Y axis");

            // TODO: make this a line , then adjust the line,

            // only update the lines that are intersected...
            if (Line.interval(intersectionRect.left, resizeRect.left, intersectionRect.right)) {
                adjustedRect.left = intersectionRect.right;
            }

            if (Line.interval(intersectionRect.left, resizeRect.right, intersectionRect.right)) {
                adjustedRect.right = intersectionRect.left;
            }

            adjustedRect.height = adjustedRect.bottom - adjustedRect.top;

        } else {

            console.log("FIXME adjusting on X axis");

            let intersectionLine = new Line(intersectionRect.left, intersectionRect.right);
            let resizeLine = new Line(resizeRect.left, resizeRect.right);

            // only update the lines that are intersected...
            if (Line.interval(intersectionRect.left, resizeRect.left, intersectionRect.right)) {
                adjustedRect.left = intersectionRect.right;
            }

            if (Line.interval(intersectionRect.left, resizeRect.right, intersectionRect.right)) {
                adjustedRect.right = intersectionRect.left;
            }

            adjustedRect.width = adjustedRect.right - adjustedRect.left;

        }

        return adjustedRect;

    }

    /**
     *
     * @param intersectionLine {Line}
     * @param resizeLine {Line}
     * @return {Line}
     */
    static adjustLine(intersectionLine, resizeLine) {

        let adjustLine = Objects.duplicate(resizeLine);

        // only update the lines that are intersected...
        if (intersectionLine.containsPoint(resizeLine.start)) {
            adjustLine.start = intersectionLine.end;
        }

        if (intersectionLine.containsPoint(resizeLine.end)) {
            adjustLine.end = intersectionLine.start;
        }

        adjustedRect.width = adjustedRect.right - adjustedRect.left;

        return adjustLine;

    }


}

module.exports.RectResizeAdjacencyCalculator = RectResizeAdjacencyCalculator;
