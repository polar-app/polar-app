import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import { IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import { ICollectionReferenceClient} from "polar-firestore-like/src/ICollectionReference";
import { IWriteBatchClient} from "polar-firestore-like/src/IWriteBatch";
import { IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";

/**
 * This is a mock store that works just like Firestore but runs out of RAM so that
 * testing is super simple.
 */
export namespace MockStore {

    type CollectionData = {readonly [id: string]: TDocumentData}

    const collections: {readonly [name: string]: CollectionData} = {};

    function requireCollection(collectionName: string) {

        if (! collections[collectionName]) {
            collections[collectionName] = {};
        }

    }

    export function create(): IFirestoreClient {

        function collection(collectionName: string): ICollectionReferenceClient {
            //
            // function doc(documentPath?: string): IDocumentReference {
            //
            //
            //     return {
            //         parent: collectionName,
            //         id: documentPath
            //     }
            //
            // }
            //
            // return {
            //     id: collectionName
            // }

            return null!;

        }

        class Batch implements IWriteBatchClient {

            create(documentRef: IDocumentReferenceClient, data: TDocumentData): IWriteBatchClient {
                throw new Error("Not implemented");
            }

            delete(documentRef: IDocumentReferenceClient): IWriteBatchClient {
                const collectionName = documentRef.parent.id;
                requireCollection(collectionName);
                delete collections[collectionName][documentRef.id];
                return this;
            }

            // set(documentRef: IDocumentReferenceClient, data: TDocumentData): IWriteBatchClient {
            //     const collectionName = documentRef.parent.id;
            //     requireCollection(collectionName);
            //     collections[collectionName][documentRef.id] = data;
            //     return this;
            // }

            // update(documentRef: IDocumentReference, data: TUpdateData): IWriteBatch {
            //     throw new Error("Not implemented");
            // }

            // update(documentRef: IDocumentReferenceClient, path: string, value: any): IWriteBatchClient {
            //     throw new Error("Not implemented");
            // }

            set(a: any, b: any, c?: any): IWriteBatchClient {
                throw new Error("not implemented");
            }

            update(a: any, b: any, c?: any): IWriteBatchClient {
                throw new Error("not implemented");
            }

            async commit(): Promise<void> {
                // noop
            }

        }

        function batch(): IWriteBatchClient {
            return new Batch();
        }

        // return {batch};

        return null!;

    }

}
