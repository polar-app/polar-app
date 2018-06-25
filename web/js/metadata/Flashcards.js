const {Preconditions} = require("../Preconditions");
const {Flashcard} = require("./Flashcard");
const {Text} = require("./Text");
const {ISODateTime} = require("./ISODateTime");
const {Hashcodes} = require("../Hashcodes");
const {AnnotationType} = require("./AnnotationType");
const {FlashcardType} = require("./FlashcardType");
const {TextType} = require("./TextType");
const {Texts} = require("./Texts");
const {Functions} = require("../util/Functions");

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

    /**
     * Create a flashcard from the raw, completed, schema form data.
     * @param data
     */
    static createFromSchemaFormData(data) {

        // require that the annotation type is correct
        if(data.annotationType !== AnnotationType.FLASHCARD) {
            throw new Error("Annotation type is incorrect: " + data.annotationType);
        }

        let fields = {};

        // now work with the formData to create the fields.
        Functions.forDict(data.formData, (key,value) => {
            let text = Texts.create(value, TextType.MARKDOWN);
            fields[key] = text;
        });

        return Flashcards.create(FlashcardType.BASIC_FRONT_BACK, fields);

    }

};

module.exports.Flashcards = Flashcards;
