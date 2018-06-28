/**
 * The internal resource entry for this Resource.
 */
class ResourceEntry {

    constructor(obj) {

        /**
         * Unique ID representing this resource in this archive.
         *
         * @type {String}
         */
        this.id = null;

        /**
         * The internal file path to this resources.
         *
         * @type {String}
         */
        this.path = null;

        /**
         *
         *
         * @type {Resource}
         */
        this.resource = null;

        Object.assign(this, obj);

    }

}

module.exports.ResourceEntry = ResourceEntry;
