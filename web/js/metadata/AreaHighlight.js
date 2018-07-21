
const {BaseHighlight} = require("./BaseHighlight.js");

class AreaHighlight extends BaseHighlight {

    constructor(val) {

        super(val);

        /**
         * The actual area for this highlight.
         *
         * @type {AreaHighlightRect}
         */
        this.rect = null;

        this.init(val);

    }

}

module.exports.AreaHighlight = AreaHighlight;
