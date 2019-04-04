import {Datastores} from './Datastores';
import {Backend} from './Backend';
import {DocMeta} from '../metadata/DocMeta';
import {PersistenceLayer} from './PersistenceLayer';
import {FirebaseDatastore} from './FirebaseDatastore';
import {FirebaseDocMetaID} from './FirebaseDatastore';
import {isPresent} from '../Preconditions';
import {URLStr} from '../util/Strings';
import {SharingDatastore} from './SharingDatastore';

export class SharingDatastores {

    /**
     * Create a sharing datastore from the given URL.
     */
    public static create(url: URLStr = this.currentURL()) {

        const params = this.parseURL(url);

        if (! params) {
            throw new Error("Not a sharing URL: " + url);
        }

        return new SharingDatastore(params.doc, params.fingerprint);

    }

    /**
     * Create a URL to a sharing datastore.
     */
    public static async createURL(persistenceLayer: PersistenceLayer,
                                  docMeta: DocMeta,
                                  baseURL: URLStr = this.currentURL()) {

        const fileRef = Datastores.toFileRef(docMeta);

        if (fileRef) {

            const docFileMeta = await persistenceLayer.getFile(Backend.STASH, fileRef, {networkLayer: 'web'});

            if (docFileMeta.isPresent()) {

                const rawURL = baseURL.replace(/http:\/\/localhost:8500\//, "https://app.getpolarized.io/");

                // we have to now replace the 'file' param with the proper URL.

                const file = docFileMeta.get().url;

                const parsedURL = new URL(rawURL);
                parsedURL.searchParams.set('file', file);
                parsedURL.searchParams.set('shared', "true");

                const userID = FirebaseDatastore.getUserID();
                const doc = FirebaseDatastore.computeDocMetaID(docMeta.docInfo.fingerprint, userID);

                parsedURL.searchParams.set('doc', doc);

                return parsedURL.toString();

            }

        }

        return undefined;

    }

    /**
     * Return true if the current URL is a sharing URL.
     */
    public static isSupported(): boolean {

        const params = this.parseURL();
        return params !== undefined;

    }

    private static parseURL(url: URLStr = this.currentURL()): SharingParams | undefined {

        const parsedURL = new URL(url);

        if (parsedURL.hostname.endsWith(".getpolarized.io")) {

            const shared = parsedURL.searchParams.get("shared");
            const doc = parsedURL.searchParams.get("doc");
            const fingerprint = parsedURL.searchParams.get("fingerprint");

            if (shared === 'true' && isPresent(doc)) {

                return {
                    shared: true,
                    doc: doc!,
                    fingerprint: fingerprint!
                };

            }

        }

        return undefined;

    }

    private static currentURL(): URLStr {
        return document.location!.href;
    }

}

interface SharingParams {
    readonly shared: boolean;
    readonly doc: FirebaseDocMetaID;
    readonly fingerprint: string;
}
