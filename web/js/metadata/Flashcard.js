const {VersionedObject} = require("./VersionedObject");

class Flashcard extends VersionedObject {

    constructor(val) {

        super(val);

        /**
         * The type of this flashcard.
         *
         * @type FlashcardType
         */
        this.type = null;

        /**
         * The content of this flashcard created by the user.
         *
         * @type map<String,Text> for each defined field.
         */
        this.fields = {};

        this.init(val);

    };

};

module.exports.Flashcard = Flashcard;
