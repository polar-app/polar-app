import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {IFirestoreError} from "polar-firestore-like/src/IFirestoreError";
import React from "react";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {
    FirestoreSnapshotConverter,
    FirestoreSnapshotSubscriber,
    IFirestoreTypedQuerySnapshot
} from "polar-firestore-like/src/FirestoreSnapshots";

export type IFirestoreSnapshotTuple<SM = unknown> = [IQuerySnapshot<SM>| undefined, IFirestoreError | undefined];

export type IFirestoreConvertedSnapshotTuple<T, SM = unknown,> = [IFirestoreTypedQuerySnapshot<T> | undefined, IFirestoreError | undefined];

/**
 * @deprecated Use FirestoreSnapshotStore
 */
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
