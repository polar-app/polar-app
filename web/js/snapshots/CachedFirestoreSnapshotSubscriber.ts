import {ISnapshot} from "./CachedSnapshotSubscriberContext";
import {LocalCache} from "./CachedSnapshotSubscriber";
import {OnErrorCallback, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import firebase from 'firebase/app'

export type OnNextCachedSnapshot<V> = (snapshot: ISnapshot<V> | undefined) => void;

export type CachedSnapshotSubscriber<V> = (onNext: OnNextCachedSnapshot<V>, onError?: OnErrorCallback) => SnapshotUnsubscriber;

interface CachedFirestoreSnapshotSubscriberOpts<V> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    readonly ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

    readonly onNext: OnNextCachedSnapshot<V>;

    readonly onError?: (err: Error) => void;

}

export function createCachedFirestoreSnapshotSubscriber<V>(opts: CachedFirestoreSnapshotSubscriberOpts<V>) {

    const cacheKey = LocalCache.createKey(opts.id);
    const initialValue = LocalCache.read<V>(cacheKey);

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
        LocalCache.write(cacheKey, snapshot);

    }

    return opts.ref.onSnapshot(onNext, opts.onError);

}
