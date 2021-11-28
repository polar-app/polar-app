import {ISnapshot} from "./CachedSnapshotSubscriberContext";
import {LocalCache} from "./CachedSnapshotSubscriber";
import {OnErrorCallback, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";

/**
 * Snapshot listener. The snapshot is only undefined on startup ad you can
 * filter this out if necessary.
 */
export type OnNextCachedSnapshot<V> = (snapshot: ISnapshot<V> | undefined) => void;

export type CachedSnapshotSubscriber<V> = (onNext: OnNextCachedSnapshot<V>, onError?: OnErrorCallback) => SnapshotUnsubscriber;

interface CachedFirestoreSnapshotSubscriberOpts<V> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    readonly ref: IDocumentReferenceClient;

    readonly onNext: OnNextCachedSnapshot<V>;

    readonly onError?: (err: Error) => void;

}

/**
 * @deprecated Move to the new react/UseSnapshot system
 */
export function createCachedFirestoreSnapshotSubscriber<V>(opts: CachedFirestoreSnapshotSubscriberOpts<V>) {

    const cacheKey = LocalCache.createKey(opts.id);
    const cachedSnapshot = LocalCache.read<V>(cacheKey);

    if (cachedSnapshot) {
        opts.onNext(cachedSnapshot);
    }

    const onNext = (firestoreSnapshot: IDocumentSnapshotClient | undefined) => {

        function toSnapshot(): ISnapshot<V> | undefined {

            if (firestoreSnapshot === undefined) {
                return undefined;
            } else {
                return {
                    exists: firestoreSnapshot.exists,
                    value: firestoreSnapshot.data() as V,
                    source: firestoreSnapshot.metadata.fromCache ? 'cache' : 'server'
                };
            }


        }

        const snapshot = toSnapshot();
        opts.onNext(snapshot);
        LocalCache.write(cacheKey, snapshot);

    }

    return opts.ref.onSnapshot(onNext, opts.onError);

}
