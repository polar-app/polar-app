/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
import {SerializedObject} from './SerializedObject';
import {PagemarkType} from './PagemarkType';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString, ISODateString} from './ISODateTimeStrings';
import {Tag} from '../tags/Tag';
import {Hashcode} from './Hashcode';
import {UUID} from './UUID';
import {ReadingOverview} from './ReadingOverview';
import {Visibility} from '../datastore/Datastore';
import {Attachment} from './Attachment';
import {Backend} from '../datastore/Backend';

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
    public backend?: Backend;
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
    public referrer?: string;
    public shareStrategy?: ShareStrategy;
    public storedResources?: Set<StoredResource>;
    public mutating?: boolean;
    public published?: ISODateString | ISODateTimeString;
    public doi?: string;
    public readingPerDay?: ReadingOverview;
    public visibility?: Visibility;
    public attachments: {[id: string]: Attachment} = {};

    constructor(val: IDocInfo) {

        super();

        this.nrPages = val.nrPages;
        this.fingerprint = val.fingerprint;

        this.init(val);

    }

    public setup() {

        this.progress = Preconditions.defaultValue(this.progress, 0);
        this.pagemarkType = this.pagemarkType || PagemarkType.SINGLE_COLUMN;
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
     * The backend of the doc. We assume STASH by default but it could be PUBLIC
     * for example docs.
     */
    backend?: Backend;

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
     * being written to allow us to de-duplicate documents and skip writes that
     * have already been applied.
     */
    uuid?: UUID;

    /**
     * The hashcode of the PDF or PHZ file to detect potential data corruption
     * of the original imported data.
     */
    hashcode?: Hashcode;

    /**
     * If this document was found and shared from the web we can include the
     * 'referer' that this page was found from.  Usually this is going to be
     * google news, hacker news, reddit, etc.
     */
    referrer?: string;

    shareStrategy?: ShareStrategy;

    storedResources?: Set<StoredResource>;

    /**
     * When true, we're mutating this entire DocMeta as a batch.  Setting it to
     * true defers writes until mutating is flipped back to false.  ALWAYS use a
     * try/finally block when updating this because if it's not set back to
     * false then writes will be lost.
     */
    mutating?: boolean;

    /**
     * The time this document was originally published according to the
     * publisher.  For a PDF this might be extracted from the internal metadata
     * and for a HTML page this might be extracted from HTML microdata or
     * opengraph information.
     */
    published?: ISODateString | ISODateTimeString;

    doi?: string;

    readingPerDay?: ReadingOverview;

    /**
     * The visibility of this document (private or public).  The default is
     * private.
     */
    visibility?: Visibility;

    attachments: {[id: string]: Attachment};

}

/**
 * How this document was shared
 *
 * saved: The user explicitly saved this document to his repository.
 *
 * navigated: The user navigated to this URL and the Polar extension
 * automatically saved it to Polar as it found it to be valuable depending
 * on the rules configured by the user + extension.
 */
export type ShareStrategy = 'saved' | 'navigated';

/**
 * How this document is stored including its dependent resources.  If the
 * document has no StoredResource it's probably.
 *
 * link: This is only a link to a document that has not yet been captured.
 *
 * doc: The content of this document only.
 *
 * styles: The CSS styles have been saved as part of catpure.  Not applicable to
 *         PDF content.
 *
 * images: The external images have also been saved with this document.
 *
 * fonts:  The dependent web fonds have been saved.
 *
 */
export type StoredResource = 'link' | 'doc' | 'styles' | 'images' | 'fonts';

export interface Storage {

    /**
     * The number of bytes used by the doc (pdf or phz file).
     */
    readonly docFile: DiskUsage;

    /**
     * The number of bytes used to store this file based on DocMeta.
     */
    readonly docMeta?: DiskUsage;
}

/**
 * Represents the disk usage of the given resources.
 */
export interface DiskUsage {
    readonly bytesUsed: number;
}

export type DocInfoLike = DocInfo | IDocInfo;
