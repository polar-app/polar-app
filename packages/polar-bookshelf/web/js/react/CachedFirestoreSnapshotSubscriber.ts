import {ISnapshot} from "../../../apps/repository/js/persistence_layer/CachedSnapshot";
import {CachedSnapshotStore} from "./CachedSnapshotSubscriber";

interface CachedFirestoreSnapshotSubscriberOpts<V> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    // readonly ref: IFirestoreDocumentReference<V>;
    readonly ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    // readonly subscribe: (onNext: (snapshot: IFirestoreSnapshot<V>) => void, onError?: (err: Error) => void) => SnapshotUnsubscriber;

    readonly onNext: (value: ISnapshot<V> | undefined) => void;

    readonly onError?: (err: Error) => void;

}

export function createCachedFirestoreSnapshotSubscriber<V>(opts: CachedFirestoreSnapshotSubscriberOpts<V>) {

    const cacheKey = CachedSnapshotStore.createKey(opts.id);
    const initialValue = CachedSnapshotStore.read<V>(cacheKey);

    if (initialValue) {
        opts.onNext(initialValue);
    }

    const onNext = (firestoreSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | undefined) => {

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
        CachedSnapshotStore.write(cacheKey, snapshot);

    }

    return opts.ref.onSnapshot(onNext, opts.onError);

}
