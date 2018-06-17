const {Objects} = require("./util/Objects");
const {Preconditions} = require("./Preconditions");

class Rects {

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

    };

    /**
     * Make sure the given rect has all the correct properties and then return
     * the rect.
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

}

module.exports.Rects = Rects;
