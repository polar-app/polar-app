/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
import {SerializedObject} from './SerializedObject';
import {PagemarkType} from './PagemarkType';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Tag} from '../tags/Tag';
import {Hashcode} from './Hashcode';

export class DocInfo extends SerializedObject implements IDocInfo {

    public nrPages: number;
    public fingerprint: string;
    public progress: number = 0;
    public pagemarkType = PagemarkType.SINGLE_COLUMN;
    public title?: string;
    public subtitle?: string;
    public description?: string;
    public url?: string;
    public lastOpened?: ISODateTimeString;
    public lastUpdated?: ISODateTimeString;
    public properties: {[id: string]: string} = {};
    public archived: boolean = false;
    public flagged: boolean = false;
    public filename?: string;
    public added?: ISODateTimeString;
    public tags?: {[id: string]: Tag} = {};
    public nrComments?: number;
    public nrNotes?: number;
    public nrFlashcards?: number;
    public nrTextHighlights?: number;
    public nrAreaHighlights?: number;
    public nrAnnotations?: number;
    public uuid?: string;
    public hashcode?: Hashcode;

    constructor(val: IDocInfo) {

        super();

        this.nrPages = val.nrPages;
        this.fingerprint = val.fingerprint;

        this.init(val);

    }

    public setup() {

        this.progress = Preconditions.defaultValue(this.progress, 0);
        this.pagemarkType = Preconditions.defaultValue(this.pagemarkType, PagemarkType.SINGLE_COLUMN);
        this.properties = Preconditions.defaultValue(this.properties, {});

    }

    public validate() {
        Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }

}

export interface IDocInfo {

    /**
     * The number of pages in this document.
     */
    nrPages: number;

    /**
     * A fingerprint for the document created from PDF.js
     */
    fingerprint: string;

    /**
     * The progress of this document (until completion) from 0 to 100.
     *
     * By default the document is zero percent complete.
     */
    progress: number;

    /**
     * Specify the pagemark type we should use to render this document.
     *
     * Usually SINGLE_COLUMN as the default but some documents need to be
     * double or single column - especially research PDFs.
     *
     */
    pagemarkType: PagemarkType;

    /**
     * The title for the document.
     */
    title?: string;

    /**
     * The subtitle for the document.
     */
    subtitle?: string;

    /**
     * The description for the document.
     */
    description?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    url?: string;

    /**
     * The last time this document was opened or null if it's never been
     * opened.
     */
    lastOpened?: ISODateTimeString;

    /**
     * The last time this document was opened or null if it's never been
     * opened.
     */
    lastUpdated?: ISODateTimeString;

    /**
     * Arbitrary name/value properties set by 3rd party extensions for this
     * document.  Anki, etc may set these properties directly.
     */
    properties: {[id: string]: string};

    /**
     * True if this document is marked 'archived'.  The user has completed
     * reading it and no longer wants it to appear front and center in the
     * repository UI.
     */
    archived: boolean;

    /**
     * True if this document was starred for prioritization.
     */
    flagged: boolean;

    /**
     * The filename of this doc in the .stash directory.
     */
    filename?: string;

    /**
     * The time this document was added to the repository.
     */
    added?: ISODateTimeString;

    /**
     * Singular key/value pairs where the id is the lowercase representation
     * of a tag and value is the human/string representation.
     */
    tags?: {[id: string]: Tag};

    /**
     * The number of comments in the document.
     */
    nrComments?: number;

    nrNotes?: number;

    /**
     * The number of flashcards in the document.
     */
    nrFlashcards?: number;

    nrTextHighlights?: number;

    nrAreaHighlights?: number;

    /**
     * The total number of annotations (comments + notes + flashcards, +
     * highlights, etc).
     */
    nrAnnotations?: number;

    /**
     * A unique uuid  for this document representing the unique document
     * number to detect changes between each commit to the datastore. Every
     * write to the datastore generates a unique sequence id for the document
     * being written.
     */
    uuid?: string;

    /**
     * The hashcode of the PDF or PHZ file to detect potential data corruption
     * of the original imported data.
     */
    hashcode?: Hashcode;

}
