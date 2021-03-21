/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Hashcode} from 'polar-shared/src/metadata/Hashcode';
import {Tag} from 'polar-shared/src/tags/Tags';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export interface RepoDocInfo {

    /**
     * The same as fingerprint but use so this is an IDType
     */
    readonly id: string;

    readonly fingerprint: string;

    readonly title: string;

    readonly progress: number;

    readonly filename?: string;

    readonly added?: ISODateTimeString;

    readonly lastUpdated?: ISODateTimeString;

    flagged: boolean;

    archived: boolean;

    readonly url?: string;

    // nrComments: number;
    // nrFlashcards: number;

    readonly tags?: Readonly<{[id: string]: Tag}>;

    readonly nrAnnotations: number;

    readonly hashcode?: Hashcode;

    readonly site?: string;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    readonly docInfo: IDocInfo;

    /**
     * The original DocMeta.  We should migrate to a system where we don't need
     * to keep this in memory but the annotation viewer needs it and it should
     * not be too hard.
     */
    readonly docMeta: IDocMeta;

    readonly fromCache: boolean;

    readonly hasPendingWrites: boolean;

}


