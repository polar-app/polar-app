const {Preconditions} = require("../Preconditions");
const {Optional} = require("../Optional");

class Styles {

    /**
     * Parse the amount of pixels from the given value.  Right now we only
     * support px but in the future we could support other types.
     *
     * @param value {string}
     * @return {number}
     */
    static parsePX(value) {

        Preconditions.assertNotNull(value, "value");

        if(value === "") {
            throw new Error("Empty string given");
        }

        return parseInt(value.replace("px", ""));
    }

    /**
     * Return the top, left, width, and height of the given element.
     *
     * @param element {HTMLElement}
     */
    static positioning(element) {

        let result = {
            left: undefined,
            top: undefined,
            right: undefined,
            bottom: undefined,
            width: undefined,
            height: undefined,
        };

        for(let key in result) {

            if(! result.hasOwnProperty(key)) {
                continue;
            }

            result[key] = Optional.of(element.style[key])
                                  .filter(current => current !== null && current !== "").getOrElse(undefined);

        }

        return result;

    }

    /**
     * Return all the positioning keys to pixels.
     */
    static positioningToPX(positioning) {

        let result = Object.assign({}, positioning);

        for(let key in result) {

            if(! result.hasOwnProperty(key)) {
                continue;
            }

            if(result[key] === null || result[key] === undefined) {
                continue;
            }

            result[key] = Styles.parsePX(result[key]);

        }

        return result;

    }

}

module.exports.Styles = Styles;
