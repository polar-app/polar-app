/**
 * Represents a light weight reference to a DocMeta file.
 */
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DocMeta} from '../metadata/DocMeta';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";

export interface DocMetaRef {

    readonly fingerprint: string;

    /**
     * A promise to the DocMeta.  If we're passing this directly the promise is
     * already resolved and just a value, but, if we have at least the
     * fingerprint or have a better reference we give a promise.
     */
    readonly docMetaProvider?: () => Promise<IDocMeta>;

}

/**
 * Includes more metadata including the filename of the PDF or PHZ file.
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

    public static createFromDocMeta(docMeta: IDocMeta): DocMetaFileRef {

        const docInfo = docMeta.docInfo;

        return {
            fingerprint: docInfo.fingerprint,
            docFile: {
                name: docInfo.filename!,
                hashcode: docInfo.hashcode
            },
            docInfo,
            docMetaProvider: () => Promise.resolve(docMeta)
        };

    }

    public static createFromDocInfo(docInfo: IDocInfo): DocMetaFileRef {

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
