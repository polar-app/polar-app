import {HeartbeatCollection} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";

export const [HeartbeatCollectionSnapshotProvider, useHeartbeatCollectionSnapshot, HeartbeatCollectionSnapshotLoader, HeartbeatCollectionSnapshotLatch]
    = createFirestoreSnapshotForUserCollection<ISpacedRep>(HeartbeatCollection.COLLECTION_NAME, {initialEmpty: true});
