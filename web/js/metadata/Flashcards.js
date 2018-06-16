const {Preconditions} = require("../Preconditions");
const {Flashcard} = require("./Flashcard");
const {Text} = require("./Text");
const {ISODateTime} = require("./ISODateTime");
const {Hashcodes} = require("../Hashcodes");

class Flashcards {

    static create(type, fields) {

        Preconditions.assertNotNull(fields, "fields");

        let now = new Date();
        let created = new ISODateTime(now);

        let id = Hashcodes.createID({created, fields});
        return new Flashcard({
            id,
            created,
            lastUpdated: new ISODateTime(now),
            type,
            fields
        });

    }

};

module.exports.Flashcards = Flashcards;
