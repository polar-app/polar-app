import {ICachedQuery} from "./ICachedQuery";
import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ICachedDoc} from "./ICachedDoc";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";
import { IQuerySnapshotClient} from "polar-firestore-like/src/IQuerySnapshot";
import { IQueryDocumentSnapshotClient} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import { IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";

export namespace CachedQueries {

    export function toCache(metadata: ICachedQueryMetadata,
                            snapshot: IQuerySnapshotClient): ICachedQuery {

        const docs = snapshot.docs;

        function toDoc(doc: IQueryDocumentSnapshotClient): ICacheQueryDocument {
            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
            };
        }

        return {
            ...metadata,
            empty: snapshot.empty,
            size: snapshot.size,
            metadata: {...snapshot.metadata},
            docs: docs.map(toDoc)
        }

    }

    export function fromCache(snapshot: ICachedQuery, index: {readonly [id: string]: ICachedDoc}): IQuerySnapshotClient {



        function toDoc(doc: ICacheQueryDocument): IQueryDocumentSnapshotClient {

            const cacheEntry = index[doc.id];

            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
                data: () => cacheEntry.data!,
                get: () => {
                    throw new Error("not implemented");
                }
            };
        }

        function toDocChange(doc: IQueryDocumentSnapshotClient): IDocumentChangeClient {
            return {
                id: doc.id,
                type: 'added',
                doc
            }
        }

        const docs = snapshot.docs.map(toDoc);

        const docChanges = (): ReadonlyArray<IDocumentChangeClient> => {
            return docs.map(toDocChange)
        }

        return {
            empty: snapshot.empty,
            size: snapshot.size,
            metadata: {...snapshot.metadata},
            docs,
            docChanges
        }

    }

}
