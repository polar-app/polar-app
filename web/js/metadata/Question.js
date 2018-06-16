const {Note} = require("./Note.js");

/**
 * Some type of follow up on content that we need to analyze.
 */
module.exports.Question = class extends Note {

    constructor(val) {

        super(val);

        this.init(val);

    };

};
