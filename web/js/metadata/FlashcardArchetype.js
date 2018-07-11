const {Preconditions} = require("../Preconditions");
const {Objects} = require("../util/Objects");


/**
 * A defined archetype for creating a flashcard.  These provide a collection of
 * defined fields that can get mapped to your card system.
 *
 * @type {FlashcardArchetype}
 */
class FlashcardArchetype {

    constructor(opts) {

        opts = Objects.defaults(opts, {
            description: "",
        });

        /**
         * The unique ID of this archetype.
         *
         * @type {null}
         */
        this.id = Preconditions.assertNotNull(opts.id, "id");

        /**
         * The name of this archetype for displaying to a user.
         *
         * @type {null}
         */
        this.name = Preconditions.assertNotNull(opts.name, "name");

        /**
         * Brief description of this archetype.
         *
         * @type {null}
         */
        this.description = opts.description;

        this.fields = opts.fields;

    }

}

module.exports.FlashcardArchetype = FlashcardArchetype;
