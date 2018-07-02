const {Symbol} = require("./Symbol.js");

module.exports.PagemarkStatus = Object.freeze({


    /**
     * We completed reading this status.
     */
    COMPLETED: new Symbol("COMPLETED"),

    /**
     * This content is 'ignored' meaning we scanned it and didn't find it
     * valuable.
     */
    IGNORED: new Symbol("IGNORED")

});
