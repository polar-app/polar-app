import {useFirestoreSnapshotSubscriber} from "../../ui/data_loader/UseFirestoreSnapshot";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import IMigration = MigrationCollection.IMigration;

export function useMigrationSnapshot() {

    const {uid, firestore} = useFirestore();

    const subscriber = MigrationCollection.createSnapshot(firestore, uid);
    const converter = React.useCallback((data: TDocumentData) => (data as IMigration), [])

    return useFirestoreSnapshotSubscriber(subscriber, converter)

}

export function useMigrationSnapshotByName(name: string) {

    const {uid, firestore} = useFirestore();

    const subscriber = MigrationCollection.createSnapshotByName(firestore, uid, name);
    const converter = React.useCallback((data: TDocumentData) => (data as IMigration), [])

    return useFirestoreSnapshotSubscriber(subscriber, converter)

}
