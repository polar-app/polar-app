class Resource {

    constructor(obj) {

        /**
         * Unique ID representing this resource in this archive.
         *
         * @type {null}
         */
        this.id = null;

        /**
         * The created time as an ISO8601 string.
         *
         * @type {null}
         */
        this.created = null;

        /**
         * Extended metadata for this resource.
         *
         * @type {Object}
         */
        this.meta = null;

        /**
         * @type {String}
         */
        this.url = null;

        /**
         *
         * The content type of this content.  Default is text/html.  We use
         * extensions of the files based on the content type.
         *
         * @type {string}
         */
        this.contentType = "text/html";

        /**
         *
         * @type {Object}
         */
        this.headers = null;

        /**
         *
         * @type {String}
         */
        this.title = null;

        /**
         *
         * @type {String}
         */
        this.description = null;

        Object.assign(this, obj);

    }

}

module.exports.Resource = Resource;
