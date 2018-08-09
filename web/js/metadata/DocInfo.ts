/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
import {SerializedObject} from './SerializedObject';
import {PagemarkType} from './PagemarkType';
import {ISODateTime} from './ISODateTime';
import {Preconditions} from '../Preconditions';

export class DocInfo extends SerializedObject {

    /**
     * The title for the document.
     */
    public title: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    public url: String;

    /**
     * The number of pages in this document.
     */
    public nrPages: number;

    /**
     * A fingerprint for the document created from PDF.js
     */
    public fingerprint: string;

    /**
     * The last time this document was opened or null if it's never been
     * opened.
     */
    public lastOpened: ISODateTime;

    /**
     * The progress of this document (until completion) from 0 to 100.
     *
     * By default the document is zero percent complete.
     *
     * @type {number}
     */
    public progress: number = 0;

    /**
     * Specify the pagemark type we should use to render this document.
     *
     * Usually SINGLE_COLUMN as the default but some documents need to be
     * double or single column - especially research PDFs.
     *
     * @type {Symbol}
     */
    public pagemarkType = PagemarkType.SINGLE_COLUMN;

    constructor(val: DocInfo) {

        super(val);

        /**
         * The title for the document.
         * @type {null}
         */
        this.title = val.title;

        /**
         * The network URL for the document where we originally fetched it.
         * @type string
         */
        this.url = val.url;

        /**
         * The number of pages in this document.
         *
         * @type number
         */
        this.nrPages = val.nrPages;

        /**
         * A fingerprint for the document created from PDF.js
         * @type string
         */
        this.fingerprint = val.fingerprint;

        /**
         * The last time this document was opened or null if it's never been
         * opened.
         *
         * @type ISODateTime
         */
        this.lastOpened = val.lastOpened;

        /**
         * The progress of this document (until completion) from 0 to 100.
         *
         * By default the document is zero percent complete.
         *
         * @type {number}
         */
        this.progress = val.progress || 0;

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

    setup() {
    }

    validate() {
        Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }

}
