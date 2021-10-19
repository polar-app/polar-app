import {IDocumentSnapshot} from "./IDocumentSnapshot";
import {IGetOptions} from "./IGetOptions";
import {ICollectionReference} from "./ICollectionReference";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {IFirestoreError} from "./IFirestoreError";
import {TDocumentData} from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import {TUpdateData} from "./TUpdateData";
import {ISetOptions} from "./ISetOptions";

export interface IDocumentSnapshotObserver<SM> {
    readonly next?: (snapshot: IDocumentSnapshot<SM>) => void;
    readonly error?: (error: IFirestoreError) => void;
    readonly complete?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDocumentSnapshotObserverClient extends IDocumentSnapshotObserver<ISnapshotMetadata> {

}

export function isDocumentSnapshotObserver<SM>(arg: any): arg is IDocumentSnapshotObserver<SM> {
    return arg.next !== undefined || arg.error !== undefined || arg.complete !== undefined;
}

export interface IPrecondition {

    /**
     * If set, the last update time to enforce.
     */
    // TODO: we don't support Timestamp right now because it's a class
    // readonly lastUpdateTime?: Timestamp;

    /**
     * If set, enforces that the target document must or must not exist.
     */
    readonly exists?: boolean;

}

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export interface IDocumentReference<SM> {

    /**
     * The Collection this `DocumentReference` belongs to.
     */
    readonly parent: ICollectionReference<SM>;

    readonly id: string;

    create(data: TDocumentData): Promise<void>;
    get(options?: IGetOptions): Promise<IDocumentSnapshot<SM>>;


    // TODO we should return WriteResult not void.
    set(data: TDocumentData): Promise<void>;
    set(data: Partial<TDocumentData>, options: ISetOptions): Promise<void>;

    update(data: TUpdateData /* , precondition?: IPrecondition*/ ): Promise<void>;
    delete(/* precondition?: IPrecondition */): Promise<void>;

    onSnapshot(observer: IDocumentSnapshotObserver<SM>): SnapshotUnsubscriber;
    onSnapshot(options: ISnapshotListenOptions, observer: IDocumentSnapshotObserver<SM>): SnapshotUnsubscriber;

    onSnapshot(onNext: (snapshot: IDocumentSnapshot<SM>) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               onNext: (snapshot: IDocumentSnapshot<SM>) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDocumentReferenceClient extends IDocumentReference<ISnapshotMetadata> {

}
