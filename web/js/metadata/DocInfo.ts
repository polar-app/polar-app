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
     * The number of pages in this document.
     */
    public nrPages: number;

    /**
     * A fingerprint for the document created from PDF.js
     */
    public fingerprint: string;

    /**
     * The progress of this document (until completion) from 0 to 100.
     *
     * By default the document is zero percent complete.
     *
     */
    public progress: number = 0;

    /**
     * Specify the pagemark type we should use to render this document.
     *
     * Usually SINGLE_COLUMN as the default but some documents need to be
     * double or single column - especially research PDFs.
     *
     */
    public pagemarkType = PagemarkType.SINGLE_COLUMN;

    /**
     * The title for the document.
     */
    public title?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    public url?: String;

    /**
     * The last time this document was opened or null if it's never been
     * opened.
     */
    public lastOpened?: ISODateTime;

    /**
     * Arbitrary name/value properties set by 3rd party extensions for this
     * document.  Anki, etc may set these properties directly.
     */
    public properties: {[id: string]: string} = {};

    constructor(val: DocInfo) {

        super(val);

        this.nrPages = val.nrPages;
        this.fingerprint = val.fingerprint;

        this.init(val);

    }

    setup() {

        this.progress = Preconditions.defaultValue(this.progress, 0);
        this.pagemarkType = Preconditions.defaultValue(this.pagemarkType, PagemarkType.SINGLE_COLUMN);
        this.properties = Preconditions.defaultValue(this.properties, {});

    }

    validate() {
        Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }

}
