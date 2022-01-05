import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {
    SpacedRepStatCollection,
    SpacedRepStatRecord,
    StatType
} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export const [SpacedRepStatCollectionSnapshotProvider, useSpacedRepStatCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<SpacedRepStatRecord>('spaced-rep-stat', SpacedRepStatCollection.COLLECTION_NAME);

export function useSpacedRepCollectionSnapshotForModeAndType(mode: RepetitionMode, type: StatType) {

    const snapshot = useSpacedRepStatCollectionSnapshot();

    if (snapshot.right) {
        return snapshot.right.docs.filter(current => {
            const data = current.data();
            return data.mode === mode && data.type === type;
        })
    } else {
        throw snapshot.left;
    }

}
