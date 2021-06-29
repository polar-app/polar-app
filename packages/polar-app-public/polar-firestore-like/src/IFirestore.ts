import { ICollectionReference } from "./ICollectionReference";
import { IWriteBatch } from "./IWriteBatch";
import {IDocumentSnapshot} from "./IDocumentSnapshot";
import {IDocumentSnapshotClient} from "./IDocumentSnapshotClient";

/**
 * Firestore mimic interface so that the firestore client SDK and admin SDK can
 * both be used with the same code.
 */
export interface IFirestore<DS extends IDocumentSnapshot = IDocumentSnapshot> {

    readonly collection: (collectionName: string) => ICollectionReference<DS>;

    readonly batch: () => IWriteBatch;

    readonly terminate: () => Promise<void>;

}

/**
 * Specific behavior for the client interface.
 */
export interface IFirestoreClient extends IFirestore<IDocumentSnapshotClient> {

    readonly clearPersistence: () => Promise<void>;

}
