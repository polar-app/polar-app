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
        this.validateMembers([
            {name: 'num', type: "number"}
        ]);
    }

}

module.exports.PageInfo = PageInfo;
