const {SerializedObject} = require("./SerializedObject.js");
const {ISODateTime} = require("./ISODateTime");


/**
 * @abstract
 */
class VersionedObject extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The unique ID for this object.  Every object needs to have a unique
         * ID so that we can reference it easily.
         *
         * @type {null}
         */
        this.id = null;

        /**
         * The time this object was created
         *
         * @type ISODateTime
         */
        this.created = null;

        /**
         * The last time this annotation was updated (note changed, moved, etc).
         * @type ISODateTime
         */
        this.lastUpdated = null;

        /**
         * The author who created this.
         *
         * @type Author
         */
        this.author = null;

        this.init(val);

    }

    setup() {
        super.setup();

        if(!this.lastUpdated && this.created) {
            this.lastUpdated = this.created;
        }

    }

    validate() {

        super.validate();

        if(!this.created) {
            throw new Error("Created is required");
        }

        // FIXME: move this to validateMembers
        if(!this.created instanceof ISODateTime) {
            throw new Error("Member created has wrong type: " + typeof this.created);
        }

        if(!this.lastUpdated instanceof ISODateTime) {
            throw new Error("Member lastUpdated has wrong type: " + typeof this.lastUpdated);
        }

    }

}

module.exports.VersionedObject = VersionedObject;
