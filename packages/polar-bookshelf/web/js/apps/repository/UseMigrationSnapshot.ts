import {useFirestoreSnapshotSubscriber} from "../../ui/data_loader/UseFirestoreSnapshot";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import IMigration = MigrationCollection.IMigration;
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";

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
