const {SerializedObject} = require("./SerializedObject.js");
const {Preconditions} = require("../Preconditions");
const {ExtendedAnnotation} = require("./ExtendedAnnotation");

class BaseHighlight extends ExtendedAnnotation {

    constructor(val) {

        super(val);

        /**
         * The rectangles where we need to place content for this highlights.
         *
         * @type {{}}
         */
        this.rects = {};

        /**
         * Optional image for this highlight.
         *
         * @type {null}
         */
        this.image = null;

    }

    validate() {
        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);
    };

};


module.exports.BaseHighlight = BaseHighlight;
