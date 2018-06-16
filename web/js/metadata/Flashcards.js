const {Preconditions} = require("../Preconditions");
const {Flashcard} = require("./Flashcard");
const {Text} = require("./Text");
const {ISODateTime} = require("./ISODateTime");

module.exports.Flashcards = class {

    static create(type, fields) {

        Preconditions.assertNotNull(fields, "fields");

        let now = new Date();

        return new Flashcard({
            created: new ISODateTime(now),
            lastUpdated: new ISODateTime(now),
            type,
            fields
        });

    }

};
