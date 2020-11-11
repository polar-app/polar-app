import { ISnapshot } from "../../../apps/repository/js/persistence_layer/CachedSnapshot";
import { OnErrorCallback, SnapshotUnsubscriber } from "polar-shared/src/util/Snapshots";
export declare type OnNextCachedSnapshot<V> = (snapshot: ISnapshot<V> | undefined) => void;
export declare type CachedSnapshotSubscriber<V> = (onNext: OnNextCachedSnapshot<V>, onError?: OnErrorCallback) => SnapshotUnsubscriber;
interface CachedFirestoreSnapshotSubscriberOpts<V> {
    readonly id: string;
    readonly ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    readonly onNext: OnNextCachedSnapshot<V>;
    readonly onError?: (err: Error) => void;
}
export declare function createCachedFirestoreSnapshotSubscriber<V>(opts: CachedFirestoreSnapshotSubscriberOpts<V>): () => void;
export {};
