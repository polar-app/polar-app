import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {SpacedRepStatCollection} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";

const [] = createFirestoreSnapshotForUserCollection(SpacedRepStatCollection.COLLECTION_NAME);
