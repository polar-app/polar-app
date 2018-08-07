const {SerializedObject} = require("./SerializedObject.js");

class Image extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The type of this image.
         *
         * @type {string}
         */
        this.type = null;

        /**
         * The src of this image.  Either an HTTP/HTTPS URL or a data: URL.
         *
         * @type {null}
         */
        this.src = null;

        /**
         * The width of this image.
         *
         * @type {number}
         */
        this.width = undefined;

        /**
         * The height of this image.
         *
         * @type {number}
         */
        this.height = undefined;

        this.init(val);

    }


}

module.exports.Image = Image;