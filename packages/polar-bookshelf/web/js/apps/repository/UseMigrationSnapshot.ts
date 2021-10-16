import {useFirestoreSnapshotSubscriber} from "../../ui/data_loader/UseFirestoreSnapshot";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import IMigration = MigrationCollection.IMigration;
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import {IFirestoreError} from "polar-firestore-like/src/IFirestoreError";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export function useMigrationSnapshot() {

    const {uid, firestore} = useFirestore();

    if (! uid) {
        throw new Error("User not authenticated");
    }

    const subscriber = MigrationCollection.createSnapshot(firestore, uid);
    const converter = React.useCallback((data: TDocumentData) => {
        return data as IMigration;
    }, [])

    return useFirestoreSnapshotSubscriber(subscriber, converter)

}

export function useMigrationSnapshotByName(name: string): [IMigration | undefined, IFirestoreError | undefined] {

    const [snapshot, error] = useMigrationSnapshot();

    const match
            = arrayStream(snapshot || [])
                .filter(current => current.name === name)
                .first();

    return [
        match,
        error
    ];

}
