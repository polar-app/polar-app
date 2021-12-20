import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {
    ISpacedRepStatRecord,
    SpacedRepStatCollection,
    StatType
} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import React from "react";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export const [SpacedRepStatCollectionSnapshotProvider, useSpacedRepStatCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<ISpacedRepStatRecord>(SpacedRepStatCollection.COLLECTION_NAME);

export function useSpacedRepCollectionSnapshotForModeAndType() {

    const snapshot = useSpacedRepStatCollectionSnapshot();

    return React.useCallback((mode: RepetitionMode, type: StatType) => {

        if (snapshot.right) {
            return snapshot.right.docs.filter(current => {
                const data = current.data();
                return data.mode === mode && data.type === type;
            })
        } else {
            throw snapshot.left;
        }

    }, [snapshot.left, snapshot.right])

}
