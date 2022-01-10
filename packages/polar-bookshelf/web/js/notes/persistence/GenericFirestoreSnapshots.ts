import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {TWhereFilterOp} from "polar-firestore-like/src/ICollectionReference";
import {IQuerySnapshotClient} from "polar-firestore-like/src/IQuerySnapshot";
import {IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IGenericQueryDocumentSnapshot} from "./IGenericQueryDocumentSnapshot";

/**
 * tuple of field path, op, and value.
 */
export type GenericClause = readonly [string, TWhereFilterOp, any];

/**
 * @deprecated use FirestoreSnapshotStore
 */
export function useGenericFirestoreSnapshots<T>(collectionName: string,
                                                clause: GenericClause,
                                                listener: (snapshot: IGenericCollectionSnapshot<T>) => void) {

    const firestoreContext = useFirestore();

    const user = firestoreContext?.user;
    const firestore = firestoreContext?.firestore;

    React.useEffect(() => {

        // FIXME: this seems to take a fair amount of time...maybe I could just cast docs and docChanges
        // which would be faster I think.

        const convertSnapshot = (current: IQuerySnapshotClient): IGenericCollectionSnapshot<T> => {

            const convertDocChange = (current: IDocumentChangeClient): IGenericDocumentChange<T> => {

                return {
                    id: current.doc.id,
                    type: current.type,
                    data: () => current.doc.data() as T
                }

            }

            return {
                empty: current.empty,
                metadata: {
                    hasPendingWrites: current.metadata.hasPendingWrites,
                    fromCache: current.metadata.fromCache
                },
                docs: current.docs as any as ReadonlyArray<IGenericQueryDocumentSnapshot<T>>,
                docChanges: current.docChanges().map(current => convertDocChange(current))
            }

        }

        const convertSnapshotMutateState = (current: IQuerySnapshotClient): void => {
            listener(convertSnapshot(current));
        }

        if (! firestore) {
            return NULL_FUNCTION;
        }

        // we have to have an 'in' clause here...
        const collection = firestore.collection(collectionName);
        const [clauseFieldPath, clauseOp, clauseValue] = clause;
        const snapshotUnsubscriber = collection.where(clauseFieldPath, clauseOp, clauseValue)
            .onSnapshot(current => convertSnapshotMutateState(current), err => {
                console.log("Received snapshot error: ", err);
            })

        return () => {
            snapshotUnsubscriber();
        }

    }, [clause, collectionName, firestore, listener, user])

}
