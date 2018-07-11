const {Preconditions} = require("../Preconditions");
const {Objects} = require("../util/Objects");


class FlashcardField {

    constructor(opts) {

        opts = Objects.defaults(opts, {
            description: "",
            rememberLastInput: false,
            required: false

        });

        /**
         * The name of this field.
         */
        this.name = Preconditions.assertNotNull(opts.name, "name");

        /**
         * @type {FlashcardFieldType}
         */
        this.type = Preconditions.assertNotNull(opts.type, "type");

        /**
         * A description for the field in the UI
         * @type {string}
         */
        this.description = opts.description;

        /**
         * When entering data for this flashcard, remember the last field.
         */
        this.rememberLastInput = opts.rememberLastInput;

        /**
         * True if this field is required by the user.
         * @type {*}
         */
        this.required = opts.required;

    }

};

module.exports.FlashcardField = FlashcardField;
