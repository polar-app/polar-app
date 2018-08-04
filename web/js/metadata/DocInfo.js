const {Preconditions} = require("../Preconditions");
const {SerializedObject} = require("./SerializedObject");
const {PagemarkType} = require("./PagemarkType.js");
const {Symbol} = require("./Symbol.js");

/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
class DocInfo extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The title for the document.
         * @type {null}
         */
        this.title = null;

        /**
         * The network URL for the document where we originally fetched it.
         * @type string
         */
        this.url = null;

        /**
         * The number of pages in this document.
         *
         * @type number
         */
        this.nrPages = null;

        /**
         * A fingerprint for the document created from PDF.js
         * @type string
         */
        this.fingerprint = null;

        /**
         * The last time this document was opened or null if it's never been
         * opened.
         *
         * @type ISODateTime
         */
        this.lastOpened = null;

        /**
         * The progress of this document (until completion) from 0 to 100.
         *
         * By default the document is zero percent complete.
         *
         * @type {number}
         */
        this.progress = 0;

        /**
         * Specify the pagemark type we should use to render this document.
         *
         * Usually SINGLE_COLUMN as the default but some documents need to be
         * double or single column - especially research PDFs.
         *
         * @type {Symbol}
         */
        this.pagemarkType = PagemarkType.SINGLE_COLUMN;

        this.init(val);

    }

    validate() {
        Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }

}

module.exports.DocInfo = DocInfo;
