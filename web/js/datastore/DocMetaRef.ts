/**
 * Represents a light weight reference to a DocMeta file.
 */
import {IDocInfo} from '../metadata/DocInfo';
import {DocMeta} from '../metadata/DocMeta';
import {Preconditions} from '../Preconditions';
import {FileRef} from './Datastore';

export interface DocMetaRef {
    readonly fingerprint: string;
}

/**
 * Includes more metadata including the filename of the PDF or PHZ file.  the
 *
 */
export interface DocMetaFileRef extends DocMetaRef {

    /**
     * The file (PDF, PHZ) which this DocInfo annotates.
     */
    readonly docFile?: FileRef;

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
            docFile: {
                name: docInfo.filename!,
                hashcode: docInfo.hashcode
            },
            docInfo
        };

    }

}
