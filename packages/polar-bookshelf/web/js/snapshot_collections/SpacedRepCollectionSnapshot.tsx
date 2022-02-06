import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";
import {SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export const [SpacedRepCollectionSnapshots, useSpacedRepCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<ISpacedRep>(SpacedRepCollection.COLLECTION_NAME, {initialEmpty: true});
