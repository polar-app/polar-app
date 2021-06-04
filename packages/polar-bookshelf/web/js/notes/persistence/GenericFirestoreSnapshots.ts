import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";
import {IGenericSnapshot} from "./IGenericSnapshot";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {TWhereFilterOp} from "polar-snapshot-cache/src/store/ICollectionReference";

/**
 * tuple of field path, op, and value.
 */
export type GenericClause = [string, TWhereFilterOp, any];

export function useGenericFirestoreSnapshots<T>(collectionName: string,
                                                clause: GenericClause,
                                                listener: (snapshot: IGenericSnapshot<T>) => void) {

    const {user, firestore} = useFirestore();

    React.useEffect(() => {

        const convertSnapshot = (current: IQuerySnapshot): IGenericSnapshot<T> => {

            const convertDocChange = (current: IDocumentChange): IGenericDocumentChange<T> => {

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
                docChanges: current.docChanges().map(current => convertDocChange(current))
            }

        }

        const convertSnapshotMutateState = (current: IQuerySnapshot): void => {
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
