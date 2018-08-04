const {Preconditions} = require("../Preconditions");
const {SerializedObject} = require("./SerializedObject.js");

class PageInfo extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The page number of this page.
         *
         * @type number.
         */
        this.num = null;

        this.init(val);

    }

    validate() {
        Preconditions.assertNumber(this.num, "num");
    }

}

module.exports.PageInfo = PageInfo;
