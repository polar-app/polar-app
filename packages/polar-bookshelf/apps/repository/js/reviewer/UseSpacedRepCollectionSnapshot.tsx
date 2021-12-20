import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";

const [SpacedRepCollectionSnapshotProvider, useSpacedRepCollectionSnapshot] = createFirestoreSnapshotForUserCollection(SpacedRepCollection.COLLECTION_NAME);
