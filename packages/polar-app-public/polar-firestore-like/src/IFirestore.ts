import { ICollectionReference } from "./ICollectionReference";
import { IWriteBatch } from "./IWriteBatch";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

/**
 * Firestore mimic interface so that the firestore client SDK and admin SDK can
 * both be used with the same code.
 */
export interface IFirestore<SM> {

    readonly collection: (collectionName: string) => ICollectionReference<SM>;

    readonly batch: () => IWriteBatch<SM>;

    readonly terminate: () => Promise<void>;

}

/**
 * Specific behavior for the client interface.
 */
export interface IFirestoreAdmin extends IFirestore<undefined> {

}

/**
 * Specific behavior for the client interface.
 */
export interface IFirestoreClient extends IFirestore<ISnapshotMetadata> {

    readonly clearPersistence: () => Promise<void>;

}
