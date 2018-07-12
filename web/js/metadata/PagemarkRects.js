const {PagemarkType} = require("./PagemarkType");
const {PagemarkRect} = require("./PagemarkRect");
const {Rects} = require("../Rects");

class PagemarkRects {

    /**
     *
     * Create a default PagemarkRect from a Pagemark that might be legacy.
     *
     * @param pagemark {Pagemark}
     * @return {PagemarkRect}
     */
    static createDefault(pagemark) {

        if(pagemark.type === PagemarkType.SINGLE_COLUMN && "percentage" in pagemark) {

            return new PagemarkRect({
                left: 0,
                top: 0,
                width: 100,
                height: pagemark.percentage
            });

        }

        throw new Error("Can not create default");

    }

    /**
     *
     * @param percentage {number}
     * @return {PagemarkRect}
     */
    static createFromPercentage(percentage) {

        return new PagemarkRect({
            left: 0,
            top: 0,
            width: 100,
            height: percentage
        });
    }


    /**
     *
     *
     * @param rect {Rect}
     * @return {PagemarkRect}
     */
    static createFromRect(rect) {

        return new PagemarkRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }


    /**
     *
     *
     * @param xAxis {Line}
     * @param yAxis {Line}
     * @return {PagemarkRect}
     */
    static createFromLines(xAxis, yAxis) {
        return PagemarkRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }

    /**
     *
     * @param rect {Rect}
     * @param parentRect {Rect}
     * @return {PagemarkRect}
     */
    static createFromPositionedRect(rect, parentRect) {

        // create a new PagemarkRect from a positioned rect.  We use this to take
        // a dragged or resized rect / box on the screen then convert it to a
        // PagemarkRect

        let xAxis = rect.toLine("x").multiply(100 / parentRect.width);
        let yAxis = rect.toLine("y").multiply(100 / parentRect.height);

        console.log("DEBUG: xAxis: " , xAxis);
        console.log("DEBUG: yAxis: " , yAxis);

        return this.createFromLines(xAxis, yAxis);

    }

}

module.exports.PagemarkRects = PagemarkRects;
