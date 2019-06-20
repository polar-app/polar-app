import {DocIDStr} from '../rpc/GroupProvisions';
import {DocMeta} from '../../../metadata/DocMeta';

export class DocRefs {

    public static fromDocMeta(docID: DocIDStr, docMeta: DocMeta): DocRef {

        return {
            docID,
            fingerprint: docMeta.docInfo.fingerprint,
            title: docMeta.docInfo.title || "",
            nrPages: docMeta.docInfo.nrPages,
            description: docMeta.docInfo.description,
            url: docMeta.docInfo.url
        };

    }

}

export interface DocRef {
    readonly docID: DocIDStr;
    readonly fingerprint: string;
    readonly title: string;
    readonly nrPages: number;
    readonly description?: string;
    readonly url?: string;
}
