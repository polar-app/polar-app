import {ICachedQueryMetadata} from "./ICachedQueryMetadata";
import {IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";
import {IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (collectionName: string, documentSnapshot: IDocumentSnapshotClient | IDocumentReferenceClient | IDocumentChangeClient) => string;

    readonly computeForQuery: (metadata: ICachedQueryMetadata) => string;

}
