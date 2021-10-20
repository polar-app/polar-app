import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {TWhereFilterOp} from "polar-firestore-like/src/ICollectionReference";
import {IQuerySnapshotClient} from "polar-firestore-like/src/IQuerySnapshot";
import {IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";

/**
 * tuple of field path, op, and value.
 */
export type GenericClause = [string, TWhereFilterOp, any];

export function useGenericFirestoreSnapshots<T>(collectionName: string,
                                                clause: GenericClause,
                                                listener: (snapshot: IGenericCollectionSnapshot<T>) => void) {

    const {user, firestore} = useFirestore();

    React.useEffect(() => {

        const convertSnapshot = (current: IQuerySnapshotClient): IGenericCollectionSnapshot<T> => {

            const convertDocChange = (current: IDocumentChangeClient): IGenericDocumentChange<T> => {

                const data: T = current.doc.data() as T;

                return {
                    id: current.doc.id,
                    type: current.type,
                    data
                }
            }

            return {
                empty: current.empty,
                metadata: {
                    hasPendingWrites: current.metadata.hasPendingWrites,
                    fromCache: current.metadata.fromCache
                },
                docs: current.docs.map(doc => doc.data() as T),
                docChanges: current.docChanges().map(current => convertDocChange(current))
            }

        }

        const convertSnapshotMutateState = (current: IQuerySnapshotClient): void => {
            listener(convertSnapshot(current));
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
