import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {SpacedRepStatCollection} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";

const [SpacedRepStatCollectionSnapshotProvider, useSpacedRepStatCollectionSnapshot] = createFirestoreSnapshotForUserCollection(SpacedRepStatCollection.COLLECTION_NAME);
