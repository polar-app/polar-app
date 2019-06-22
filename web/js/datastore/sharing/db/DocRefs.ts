import {DocIDStr} from '../rpc/GroupProvisions';
import {DocMeta} from '../../../metadata/DocMeta';
import {DocRef} from 'polar-shared/src/groups/DocRef';

export class DocRefs {

    public static fromDocMeta(docID: DocIDStr, docMeta: DocMeta): DocRef {

        return {
            docID,
            fingerprint: docMeta.docInfo.fingerprint,
            title: docMeta.docInfo.title || "",
            subtitle: docMeta.docInfo.subtitle,
            nrPages: docMeta.docInfo.nrPages,
            description: docMeta.docInfo.description,
            url: docMeta.docInfo.url,
            // TODO: only accept regular tags and non-special key/value tags.
            tags: docMeta.docInfo.tags,
            published: docMeta.docInfo.published,
            doi: docMeta.docInfo.doi
        };

    }

}
