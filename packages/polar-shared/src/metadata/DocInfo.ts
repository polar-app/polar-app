import {PagemarkType} from './PagemarkType';
import {Preconditions} from '../Preconditions';
import {ISODateString, ISODateTimeString} from './ISODateTimeStrings';
import {Hashcode} from './Hashcode';
import {ReadingOverview} from './ReadingOverview';
import {Attachment} from './Attachment';
import {Backend} from './Backend';
import {Tag} from '../tags/Tags';
import {DocMutating, IDocInfo, ShareStrategy, StoredResource} from "./IDocInfo";
import {Visibility} from "../datastore/Visibility";
import {IDocAuthor} from "./IDocAuthor";
import {IThumbnail} from "./IThumbnail";
import {IText} from "./Text";
import {SerializedObject} from "./SerializedObject";

/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
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
    public bytes?: number;
    public referrer?: string;
    public shareStrategy?: ShareStrategy;
    public storedResources?: Set<StoredResource>;
    public mutating?: DocMutating;
    public published?: ISODateString | ISODateTimeString;
    public publisher?: string;
    public doi?: string;
    public pmid?: string;
    public readingPerDay?: ReadingOverview;
    public visibility?: Visibility;
    public attachments: {[id: string]: Attachment} = {};
    public authors?: ReadonlyArray<IDocAuthor>;
    public thumbnails?: { [id: string]: IThumbnail };
    public summary?: IText;
    public webCapture?: boolean;

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
        Preconditions.assertPresent(this.fingerprint, "fingerprint");
    }

}

export type DocInfoLike = DocInfo | IDocInfo;
