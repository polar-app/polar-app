import {ICollectionReference} from "./ICollectionReference";
import {IWriteBatch} from "./IWriteBatch";

/**
 * Firestore mimic interface.
 * @deprecated use polar-firestore-like
 */
export interface IFirestore {

    readonly collection: (collectionName: string) => ICollectionReference;

    readonly batch: () => IWriteBatch;

    readonly terminate: () => Promise<void>;

    readonly clearPersistence: () => Promise<void>;

}
