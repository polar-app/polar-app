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

        this.mimeType = "text/html";

        this.encoding = "UTF-8";

        /**
         * The HTTP request method.
         *
         * @type {String}
         */
        this.method = "GET";

        /**
         * The status code for this content.
         *
         * @type {number}
         */
        this.statusCode = 200;

        /**
         * The content length of the content or null when unknown.
         *
         * @type {String}
         */
        this.contentLength = null;

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
