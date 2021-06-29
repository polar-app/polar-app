import { ICollectionReference } from "./ICollectionReference";
import { IWriteBatch } from "./IWriteBatch";

/**
 * Firestore mimic interface so that the firestore client SDK and admin SDK can
 * both be used with the same code.
 */
export interface IFirestore {

    readonly collection: (collectionName: string) => ICollectionReference;

    readonly batch: () => IWriteBatch;

    readonly terminate: () => Promise<void>;

    readonly clearPersistence: () => Promise<void>;

}
