import {IFirestoreError} from "./IFirestoreError";
import {TDocumentData} from "./TDocumentData";

export type FirestoreSnapshotUnsubscriber = () => void;

export type FirestoreOnErrorCallback = (err: IFirestoreError) => void;

export type FirestoreOnNextCallback<V> = (value: V) => void;

export type FirestoreSnapshotSubscriber<V> = (onNext: FirestoreOnNextCallback<V>, onError?: FirestoreOnErrorCallback) => FirestoreSnapshotUnsubscriber;

export type FirestoreSnapshotConverter<T> = (data: TDocumentData) => T;
