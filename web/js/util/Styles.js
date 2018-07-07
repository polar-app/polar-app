const {Preconditions} = require("../Preconditions");
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

}

module.exports.Styles = Styles;
