/**
 * Represents a light weight reference to a DocMeta file.
 */
import {IDocInfo} from '../metadata/DocInfo';
import {DocMeta} from '../metadata/DocMeta';
import {Preconditions} from '../Preconditions';

export interface DocMetaRef {
    readonly fingerprint: string;
}

/**
 * Includes more metadata including the filename of the PDF or PHZ file.  the
 *
 */
export interface DocMetaFileRef extends DocMetaRef {

    readonly filename: string;

    readonly docInfo: IDocInfo;

}

export class DocMetaFileRefs {

    public static createFromDocMeta(docMeta: DocMeta): DocMetaFileRef {

        return this.createFromDocInfo(docMeta.docInfo);

    }

    public static createFromDocInfo(docInfo: IDocInfo): DocMetaFileRef {

        Preconditions.assertPresent(docInfo.filename);

        return {
            fingerprint: docInfo.fingerprint,
            filename: docInfo.filename!,
            docInfo
        };

    }

}
