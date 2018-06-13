const {Note} = require("./Note.js");

/**
 * A defined template for creating a flashcard.  These provide a collection of
 * defined fields that can get mapped to your card system.
 *
 * @type {FlashcardTemplate}
 */
module.exports.FlashcardTemplate = class extends Note {

    constructor(val) {

        super(val);

    };

};
