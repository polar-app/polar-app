import {IDStr} from "polar-shared/src/util/Strings";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {isPresent} from 'polar-shared/src/Preconditions';
import {IFirestore} from "polar-firestore-like/src/IFirestore";

/**
 * Provides for a generic writer that can commit records to Firebase (frontend or backend)
 */
export namespace FirebaseDatastoresShared {

    export enum DatastoreCollection {

        DOC_INFO = "doc_info",

        DOC_META = "doc_meta",

    }

    export type FirestoreSource = 'default' | 'server' | 'cache';

    export interface GetDocMetaOpts {

        readonly preferredSource?: FirestoreSource;

    }

    /**
     * Get the DocMeta if from the raw docID encoded into the users account.
     */
    export async function getDocMeta(firestore: IFirestore<unknown>,
                                     id: IDStr,
                                     opts: GetDocMetaOpts = {}): Promise<string | null> {

        const ref = firestore
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        const createSnapshot = async () => {

            // TODO: lift this out into its own method.

            const preferredSource = opts.preferredSource;

            if (preferredSource === 'cache') {

                // Firebase supports three cache strategies.  The first
                // (default) is server with fall back to cache but what we
                // need is the reverse.  We need cache but server refresh to
                // pull the up-to-date copy.
                //
                // What we now do is we get two promises, then return the
                // first that works or throw an error if both fail.
                //
                // In this situation we ALWAYs go to the server though
                // because we need to get the up-to-date copy to refresh
                // BUT we can get the initial version FASTER since we
                // can resolve it from cache.

                console.log("getDocMeta: cache+server");

                // TODO: this will NOT work because 'cache' will throw an
                // exception if it is not in the cache! but this mode isn't used
                // anymore since we're 100% on Firebase now.
                const cachePromise = ref.get({ source: 'cache' });
                const serverPromise = ref.get({ source: 'server' });

                const cacheResult = await cachePromise;

                if (cacheResult.exists) {
                    return cacheResult;
                }

                return await serverPromise;

            } else if (isPresent(opts.preferredSource)) {
                console.log("getDocMeta: " + opts.preferredSource);
                return await ref.get({ source: opts.preferredSource });
            } else {
                // now revert to checking the server, then cache if we're
                // offline.
                console.log("getDocMeta: standard" );
                return await ref.get();
            }

        };

        const snapshot = await createSnapshot();

        const recordHolder = <RecordHolder<DocMetaHolder> | undefined> snapshot.data();

        if (! recordHolder) {
            console.warn("Could not get docMeta with id: " + id);
            return null;
        }

        return recordHolder.value.value;

    }

}
