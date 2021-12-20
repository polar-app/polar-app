import React from "react";
import {createFirestoreSnapshotForUserCollection} from "../../../../web/js/stores/FirestoreSnapshotStore";
import {SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

const [SpacedRepCollectionSnapshotProvider, useSpacedRepCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<ISpacedRep>(SpacedRepCollection.COLLECTION_NAME);
