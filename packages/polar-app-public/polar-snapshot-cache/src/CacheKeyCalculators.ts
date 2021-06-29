import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";
import {IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";
import {IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";

export namespace CacheKeyCalculators {

    /**
     * Create a generic cache key calculator that uses the collection name and the id
     * of the document.  For snapshots, we use a snapshotKey such that EVERY snapshot
     * has the same key.
     *
     * We should
     */
    export function createGeneric(): ICacheKeyCalculator {

        function computeForDoc(collectionName: string, documentSnapshot: IDocumentSnapshotClient | IDocumentReferenceClient | IDocumentChangeClient): string {
            return collectionName + ':' + documentSnapshot.id;
        }

        function computeForQuery(metadata: ICachedQueryMetadata): string {
            return Hashcodes.create(metadata);
        }

        return {computeForDoc, computeForQuery};

    }

}
