import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {CollectionNameStr} from "polar-shared/src/util/Strings";
import {IQuery} from "polar-firestore-like/src/IQuery";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {IWhereClause} from "polar-firestore-like/src/ICollectionReference";
import {IFirestoreError} from "polar-firestore-like/src/IFirestoreError";
import React from "react";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {
    FirestoreSnapshotConverter,
    FirestoreSnapshotSubscriber,
    IFirestoreTypedQuerySnapshot
} from "polar-firestore-like/src/FirestoreSnapshots";

interface IFirestoreSnapshotOpts {
    readonly offset?: number;
    readonly limit?: number;
    readonly where?: ReadonlyArray<IWhereClause>;
}

export type IFirestoreSnapshotTuple<SM = unknown> = [IQuerySnapshot<SM>| undefined, IFirestoreError | undefined];

/**
 * Get a snapshot from Firestore but also allow the user to subscribe by types
 * to it and receive updates.
 */
export function useFirestoreSnapshot(collectionName: CollectionNameStr, opts: IFirestoreSnapshotOpts = {}): IFirestoreSnapshotTuple {

    const {firestore} = useFirestore();

    const [snapshot, setSnapshot] = React.useState<IQuerySnapshot<ISnapshotMetadata> | undefined>(undefined);
    const [error, setError] = React.useState<IFirestoreError | undefined>(undefined);

    const onNext = React.useCallback((snapshot: IQuerySnapshot<ISnapshotMetadata>) => {
        setSnapshot(snapshot);
    }, []);

    const onError = React.useCallback((err: IFirestoreError) => {
        setError(err);
    }, []);

    React.useEffect(() => {

        let query: IQuery<ISnapshotMetadata> = firestore.collection(collectionName);

        if (opts.offset) {
            query = query.offset(opts.offset)
        }

        if (opts.limit) {
            query = query.limit(opts.limit)
        }

        if (opts.where) {
            for(const where of opts.where) {
                query = query.where(where.fieldPath, where.opStr, where.value);
            }
        }

        return query.onSnapshot(onNext, onError);

    }, [collectionName, firestore, onError, onNext, opts.limit, opts.offset, opts.where]);

    return [snapshot, error];

}

export type IFirestoreConvertedSnapshotTuple<T, SM = unknown,> = [IFirestoreTypedQuerySnapshot<T> | undefined, IFirestoreError | undefined];

export function useFirestoreSnapshotSubscriber<T, SM = unknown>(subscriber: FirestoreSnapshotSubscriber<IQuerySnapshot<SM>>,
                                                                      converter: FirestoreSnapshotConverter<T>): IFirestoreConvertedSnapshotTuple<T, SM> {

    const {firestore} = useFirestore();

    const [snapshot, setSnapshot] = React.useState<IFirestoreTypedQuerySnapshot<T> | undefined>(undefined);
    const [error, setError] = React.useState<IFirestoreError | undefined>(undefined);

    const onNext = React.useCallback((snapshot: IQuerySnapshot<SM>) => {

        if (snapshot) {

            const docs = snapshot.empty ? []  : snapshot.docs;

            setSnapshot({
                empty: snapshot.empty,
                size: snapshot.size,
                metadata: snapshot.metadata,
                docs: docs.map(current => converter(current.data()))
            });

        } else {
            setSnapshot(undefined);
        }

    }, [converter]);

    const onError = React.useCallback((err: IFirestoreError) => {
        setError(err);
    }, []);

    React.useEffect(() => {

        return subscriber(onNext, onError);

    }, [firestore, onError, onNext, subscriber]);

    return [snapshot, error];

}
