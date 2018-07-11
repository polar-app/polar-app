const {VersionedObject} = require("./VersionedObject");

/**
 * Private note describing this object.  Meant to last a long time.
 */
class Note extends VersionedObject {

    constructor(val) {

        super(val);

        /**
         * The content of this note.
         *
         * @type {Text}
         */
        this.content = null;

        this.init(val);

    };

    setup() {

        if(!this.content) {
            this.content = "";
        }

    }

    validate() {

        if(!this.created) {
            throw new Error("The field `created` is required.");
        }

    }

};

module.exports.Note = Note;
