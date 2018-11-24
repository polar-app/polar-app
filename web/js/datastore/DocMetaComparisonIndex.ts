import {DocMeta} from '../metadata/DocMeta';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {DocUUID} from './CloudAwareDatastore';
import {isPresent} from '../Preconditions';

/**
 * The DocComparisonIndex allows us to detect which documents are local already
 * so that when we receive document from the cloud datastore we can decide
 * that we do not need to replicate it locally.
 */
export class DocMetaComparisonIndex {

    private readonly backing: {[fingerprint: string]: DocUUID} = {};

    public contains(fingerprint: string) {
        return isPresent(this.backing[fingerprint]);
    }

    public get(fingerprint: string): DocUUID | undefined {
        return this.backing[fingerprint];
    }

    public remove(fingerprint: string) {
        delete this.backing[fingerprint];
    }

    public putDocMeta(docMeta: DocMeta) {

        this.backing[docMeta.docInfo.fingerprint] = {
            fingerprint: docMeta.docInfo.fingerprint,
            uuid: docMeta.docInfo.uuid
        };

    }

    public putDocInfo(docInfo: IDocInfo) {

        this.backing[docInfo.fingerprint] = {
            fingerprint: docInfo.fingerprint,
            uuid: docInfo.uuid
        };

    }

}
