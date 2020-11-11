import { OnErrorCallback, OnNextCallback, SnapshotSubscriberWithID, SnapshotSubscriber, SnapshotTuple } from 'polar-shared/src/util/Snapshots';
export interface SubscriptionValue<T> {
    readonly value: T | undefined;
    readonly error: Error | undefined;
}
export declare function useSnapshotSubscriberUsingCallbacks<T>(subscriber: SnapshotSubscriberWithID<T>, onNext: OnNextCallback<T>, onError?: OnErrorCallback): void;
export declare function useSnapshotSubscriber<T>(subscriber: SnapshotSubscriberWithID<T>): SubscriptionValue<T>;
export declare function useSnapshots<T>(subscriber: SnapshotSubscriber<T>): SnapshotTuple<T>;
