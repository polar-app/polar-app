import {Dicts} from '../util/Dicts';
import {FlashcardType} from './FlashcardType';
import {Hashcodes} from '../Hashcodes';
import {Preconditions} from '../Preconditions';

const {Flashcard} = require("./Flashcard");
const {ISODateTime} = require("./ISODateTime");
const {TextType} = require("./TextType");
const {Texts} = require("./Texts");
const {Functions} = require("../util/Functions");

export class Flashcards {

    static create(type: FlashcardType, fields: {[key: string]: Text }) {

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
     **
     */
    static createFromSchemaFormData(formData: {[path: string]: string }) {

        // TODO: the markdown needs to be converted to HTML as well.  The text
        // we get from the markdown widget is markdown. Not HTML and I confirmed
        // this is the case.

        let fields: {[key: string]: Text } = {};

        // now work with the formData to create the fields.
        Dicts.ownKeys(formData, (key, value) => {
            fields[key] = Texts.create(value, TextType.HTML);
        });

        return Flashcards.create(FlashcardType.BASIC_FRONT_BACK, fields);

    }

}
