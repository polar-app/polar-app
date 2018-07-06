const {Objects} = require("./util/Objects");
const {Preconditions} = require("./Preconditions");

class Rects {

    /**
     * Make sure the rect is visible. If it has a zero width or height it's
     * not visible.
     * @param rect {Rect | DOMRect}
     * @return boolean True when the rect is visible.
     */
    static isVisible(rect) {
        return rect.height > 0 && rect.width > 0;
    }

    /**
     * Scale the rect based on the current values and the given scale.
     */
    static scale(rect, scale) {

        Preconditions.assertNotNull(rect, "rect");
        // make sure the input is valid before we work on it.
        rect = Rects.validate(rect);

        rect = Objects.duplicate(rect);

        for(let key in rect) {

            if(! rect.hasOwnProperty(key))
                continue;

            rect[key] = rect[key] * scale;

        }

        return Rects.validate(rect);

    }

    /**
     * Make sure the given rect has all the correct properties and then return
     * the rect.
     *
     * @return {Rect}
     */
    static validate(rect) {

        Preconditions.assertNotNull(rect.left, "left");
        Preconditions.assertNotNull(rect.top, "top");
        Preconditions.assertNotNull(rect.width, "width");
        Preconditions.assertNotNull(rect.height, "height");
        Preconditions.assertNotNull(rect.bottom, "bottom");
        Preconditions.assertNotNull(rect.right, "right");

        Preconditions.assertNumber(rect.left, "left");
        Preconditions.assertNumber(rect.top, "top");
        Preconditions.assertNumber(rect.width, "width");
        Preconditions.assertNumber(rect.height, "height");
        Preconditions.assertNumber(rect.bottom, "bottom");
        Preconditions.assertNumber(rect.right, "right");

        return rect;

    }

    /**
     * Assume that the given rect is relative to the point and return the new
     * rect.
     *
     * @param point {Point}
     */
    static relativeTo(point, rect) {

        rect = Objects.duplicate(rect);

        rect.left = rect.left + point.x;
        rect.top = rect.top + point.y;

        rect.right = rect.right + point.x;
        rect.bottom = rect.bottom + point.y;

        return Rects.validate(rect);

    }

    /**
     * Create a full rect from a rect that has top,left,width,height only.
     * @param rect {Rect}
     * @return {Rect}
     */
    static createFromBasicRect(rect) {

        rect = Objects.duplicate(rect);

        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;

        return Rects.validate(rect);

    }

}

module.exports.Rects = Rects;
