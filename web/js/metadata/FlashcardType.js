const {Symbol} = require("./Symbol.js");

/**
 * The type of the flashcard.
 */
module.exports.FlashcardType = Object.freeze({

    CLOZURE: new Symbol("CLOZURE"),

    BASIC_FRONT_BACK: new Symbol("BASIC_FRONT_BACK"),

    // Create two derived views.  The front and back and then the reverse
    // (reverse with the back->front)
    BASIC_FRONT_BACK_AND_REVERSE: new Symbol("BASIC_FRONT_BACK_AND_REVERSE"),

    // the reverse is optional
    BASIC_FRONT_BACK_OR_REVERSE: new Symbol("BASIC_FRONT_BACK_OR_REVERSE")

});
