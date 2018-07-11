const {Note} = require("./Note.js");

/**
 * Some type of follow up on content that we need to analyze.
 */
class Question extends Note {

    constructor(val) {

        super(val);

        this.init(val);

    };

};

module.exports.Question = Question;
