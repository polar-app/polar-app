/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {ISODateTimeString} from '../../../web/js/metadata/ISODateTimeStrings';
import {Tag} from '../../../web/js/tags/Tag';
import {Hashcode} from '../../../web/js/metadata/Hashcode';

export interface RepoDocInfo {

    fingerprint: string;

    title: string;

    progress: number;

    filename?: string;

    added?: ISODateTimeString;

    lastUpdated?: ISODateTimeString;

    // lastUpdated?: string;

    flagged: boolean;

    archived: boolean;

    url?: string;

    // nrComments: number;
    // nrFlashcards: number;

    tags?: Readonly<{[id: string]: Tag}>;

    nrAnnotations: number;

    hashcode?: Hashcode;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    docInfo: IDocInfo;

}


