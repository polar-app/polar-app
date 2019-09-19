/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
import {SerializedObject} from './SerializedObject';
import {PagemarkType} from './PagemarkType';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {ISODateString, ISODateTimeString} from './ISODateTimeStrings';
import {Hashcode} from './Hashcode';
import {ReadingOverview} from './ReadingOverview';
import {Attachment} from './Attachment';
import {Backend} from '../datastore/Backend';
import {Tag} from '../tags/Tags';
import {DocMutating, IDocInfo, ShareStrategy, StoredResource} from "polar-shared/src/metadata/IDocInfo";
import {Visibility} from "../datastore/Visibility";

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
    public mutating?: DocMutating;
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

export type DocInfoLike = DocInfo | IDocInfo;
