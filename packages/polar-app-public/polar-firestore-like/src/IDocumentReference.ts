import { IDocumentSnapshot } from "./IDocumentSnapshot";
import {IGetOptions} from "./IGetOptions";
import {ICollectionReference} from "./ICollectionReference";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {SnapshotUnsubscriber} from "./IQuery";
import {IFirestoreError} from "./IFirestoreError";
import {TDocumentData} from "./TDocumentData";

export interface IDocumentSnapshotObserver<DS extends IDocumentSnapshot = IDocumentSnapshot> {
    readonly next?: (snapshot: DS) => void;
    readonly error?: (error: IFirestoreError) => void;
    readonly complete?: () => void;
}

export function isDocumentSnapshotObserver(arg: any): arg is IDocumentSnapshotObserver {
    return arg.next !== undefined || arg.error !== undefined || arg.complete !== undefined;
}

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export interface IDocumentReference<DS extends IDocumentSnapshot = IDocumentSnapshot> {

    /**
     * The Collection this `DocumentReference` belongs to.
     */
    readonly parent: ICollectionReference<DS>;

    readonly id: string;

    get(options?: IGetOptions): Promise<DS>;
    set(data: TDocumentData): Promise<void>;
    delete(): Promise<void>;

    onSnapshot(observer: IDocumentSnapshotObserver<DS>): SnapshotUnsubscriber;
    onSnapshot(options: ISnapshotListenOptions, observer: IDocumentSnapshotObserver<DS>): SnapshotUnsubscriber;

    onSnapshot(onNext: (snapshot: DS) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               onNext: (snapshot: DS) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

}
