const {Preconditions} = require("../../../../Preconditions");

/**
 * Like {RectEdges} but only for lines and only for start and end.
 */
class LineEdges {

    constructor(obj) {

        /**
         * @type {boolean}
         */
        this.start = undefined;

        /**
         * @type {boolean}
         */
        this.end = undefined;

        Object.assign(this, obj);

        //  make sure we have all the values.

        Preconditions.assertTypeof(this.start, "start", "boolean");
        Preconditions.assertTypeof(this.end, "end", "boolean");

    }

}

module.exports.LineEdges = LineEdges;
