
const {BaseHighlight} = require("./BaseHighlight.js");

class AreaHighlight extends BaseHighlight {

    constructor(val) {

        super(val);

        this.init(val);

    }

}

module.exports.AreaHighlight = AreaHighlight;
