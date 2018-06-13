const {Preconditions} = require("../Preconditions");

module.exports.FlashcardField = class extends Note {

    constructor(name, type, description, rememberLastInput) {

        super();

        /**
         * The name of this field.
         */
        this.name = Preconditions.assertNotNull(type, "name");

        /**
         * @type {FlashcardFieldType}
         */
        this.type = Preconditions.assertNotNull(type, "type");

        /**
         * A description for the field in the UI
         * @type {string}
         */
        this.description = Preconditions.defaultValue(description, "");


        /**
         * When entering data for this flashcard, remember the last field.
         */
        this.rememberLastInput = Preconditions.defaultValue(rememberLastInput, false);

    };

};
