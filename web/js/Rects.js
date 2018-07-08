const {Objects} = require("./util/Objects");
const {Preconditions} = require("./Preconditions");
const {Rect} = require("./Rect");
const {Styles} = require("./util/Styles");

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
     * Assume that the given rect is relative to the point and return the new
     * rect.
     *
     * This adjust ALL properties including top, left, bottom, right
     *
     * @param rect {Rect} The rect to move.
     * @param dir {Object} Move the rect in the given dir (direction) in the
     * x and y plane.  The dir.x and dir.y specify how much to move the rect.
     * @param absolute {boolean} When true, move to the absolute position, not
     *                           relative.
     */
    static move(rect, dir, absolute) {

        rect = Objects.duplicate(rect);

        // TODO: I could just convert the relative positions to absolute

        if(absolute) {

            if(dir.x) {
                rect.left = dir.x;
                rect.right = rect.left + rect.width;
            }

            if(dir.y) {
                rect.top = dir.y;
                rect.bottom = rect.top + rect.height;
            }

        } else {

            if(dir.x) {
                rect.left = rect.left + dir.x;
                rect.right = rect.right + dir.x;
            }

            if(dir.y) {
                rect.bottom = rect.bottom + dir.y;
                rect.top = rect.top + dir.y;
            }

        }

        return Rects.validate(rect);

    }

    /**
     * Return true if the two rects intersect.
     * @param a {Rect|Object}
     * @param b {Rect|Object}
     * @return {boolean}
     */
    static intersect(a, b) {
        return (a.left <= b.right &&
                b.left <= a.right &&
                a.top <= b.bottom &&
                b.top <= a.bottom)
    }

    /**
     * Return the positions where `a` (reference) is intersected by `b`.  If
     * all four sizes are present a envelops b.
     *
     * @return {Array<string>}
     */
    static intersectedPositions(a, b) {

        let result = [

        ];

        if(_interval(a.left, b.right, a.right)) {
            result.push("left");
        }

        if(_interval(a.left, b.left, a.right)) {
            result.push("right");
        }

        if(_interval(a.top, b.bottom, a.bottom)) {
            result.push("top");
        }

        if(_interval(a.top, b.top, a.bottom)) {
            result.push("bottom");
        }

        return result;

    }

    /**
     * Subtract second rect from the first and return a virtual rect with the
     * change in elements. The change is virtual as we could record a rect with
     * negative width for a given line which would be an imaginary geometric
     * object.
     *
     * @param a {Rect}
     * @param b {Rect}
     */
    static subtract(a, b) {

        a = Rects.validate(a);
        b = Rects.validate(b);

        let keys = ["left", "top", "right", "bottom", "width", "height"];

        let result = {};

        keys.forEach(key => {
            result[key] = a[key] - b[key];
        });

        return new Rect(result);

    }

    /**
     * Add two rects together to build a new rect.  The second rect could be
     * virtual and have a negative width for a line.
     *
     * @param a {Rect}
     * @param b {Rect}
     */
    static add(a, b) {

        a = Rects.validate(a);
        b = Rects.validate(b);

        let keys = ["left", "top", "right", "bottom", "width", "height"];

        let result = {};

        keys.forEach(key => {
            result[key] = a[key] + b[key];
        });

        return new Rect(result);

    }

    /**
     * Create a full rect from a rect that has top, left, width, height only.
     *
     * @param rect {Rect | Object}
     * @return {Rect}
     */
    static createFromBasicRect(rect) {

        rect = Objects.duplicate(rect);

        // TODO: add x,y in the future.

        // the optional ones are bottom+right or width+height but we could add
        // support for other optional ones...

        if(! rect.bottom && rect.height && rect.top) {
            rect.bottom = rect.top + rect.height;
        }

        if(! rect.right && rect.width && rect.left) {
            rect.right = rect.left + rect.width;
        }

        if(! rect.height && rect.bottom && rect.top) {
            rect.height = rect.bottom - rect.top;
        }

        if(! rect.width && rect.right && rect.left) {
            rect.width = rect.right - rect.left;
        }

        return Rects.validate(new Rect(rect));

    }

    /**
     * Parse the positioning from the style with left, top width and height and then
     * return this as a rect.
     * @param element {HTMLElement}
     */
    static fromElementStyle(element) {

        return Rects.createFromBasicRect({

            left: Styles.parsePX(element.style.left),
            top: Styles.parsePX(element.style.top),
            width: Styles.parsePX(element.style.width),
            height: Styles.parsePX(element.style.height)

        });

    }

}

/**
 * Return true if the point is within the given min and max interval.
 *
 * @param min {number}
 * @param point {number}
 * @param max {number}
 * @private
 * @return {boolean}
 */
function _interval(min,point,max) {
    return min <= point && point <= max;

}


module.exports.Rects = Rects;
