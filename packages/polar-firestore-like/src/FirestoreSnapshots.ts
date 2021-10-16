import {IFirestoreError} from "./IFirestoreError";
import {TDocumentData} from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export type FirestoreSnapshotUnsubscriber = () => void;

export type FirestoreOnErrorCallback = (err: IFirestoreError) => void;

export type FirestoreOnNextCallback<V> = (value: V) => void;

export type FirestoreSnapshotSubscriber<V> = (onNext: FirestoreOnNextCallback<V>, onError?: FirestoreOnErrorCallback) => FirestoreSnapshotUnsubscriber;

export type FirestoreSnapshotConverter<T> = (data: TDocumentData) => T;

export interface IFirestoreTypedQuerySnapshot<T> {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<T>;

}
/**
 * Similar to a firestore document snapshot but converted to a specific type.
 */
export interface IFirestoreTypedDocumentSnapshot<T> {

    /**
     * Property of the `DocumentSnapshot` that signals whether or not the data
     * exists. True if the document exists.
     */
    readonly exists: boolean;

    /**
     * Property of the `DocumentSnapshot` that provides the document's ID.
     */
    readonly id: string;

    readonly data: T;

}

export function FIRESTORE_NULL_SNAPSHOT_SUBSCRIBER<V>(onNext: FirestoreOnNextCallback<V>, onError?: FirestoreOnErrorCallback) {
    return NULL_FUNCTION;
}
