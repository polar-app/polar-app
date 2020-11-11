import { SnapshotSubscriber, SnapshotUnsubscriber } from "polar-shared/src/util/Snapshots";
import { ISnapshot } from "../../../apps/repository/js/persistence_layer/CachedSnapshot";

export interface CachedSnapshotSubscriberOpts<V> {
    readonly id: string;
    readonly subscriber: SnapshotSubscriber<ISnapshot<V>>;
    readonly onNext: (value: ISnapshot<V> | undefined) => void;
    readonly onError: (err: Error) => void;
}
export declare namespace CachedSnapshotStore {
    function read<V>(cacheKey: string): ISnapshot<V> | undefined;
    function write<V>(cacheKey: string, snapshot: ISnapshot<V> | undefined): void;
    function createKey(id: string): string;
}
export declare function createCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>): SnapshotUnsubscriber;
export declare function useCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>): void;
