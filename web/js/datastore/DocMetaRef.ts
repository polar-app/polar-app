/**
 * Represents a light weight reference to a DocMeta file.
 */
import {DocInfo} from '../metadata/DocInfo';

export interface DocMetaRef {
    readonly fingerprint: string;
}

/**
 * Includes more metadata including the filename.
 */
export interface DocMetaFileRef extends DocMetaRef {
    readonly filename: string;
    readonly docInfo: DocInfo;
}
