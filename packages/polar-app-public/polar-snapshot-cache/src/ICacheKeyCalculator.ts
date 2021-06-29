import {ICachedQueryMetadata} from "./ICachedQueryMetadata";
import {IDocumentSnapshot} from "polar-firestore-like/src/IDocumentSnapshot";
import {IDocumentChange} from "polar-firestore-like/src/IDocumentChange";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (collectionName: string, documentSnapshot: IDocumentSnapshot | IDocumentReference | IDocumentChange) => string;

    readonly computeForQuery: (metadata: ICachedQueryMetadata) => string;

}
