import {Firestore} from "../../../../web/js/firebase/Firestore";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {SpacedRepStats} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import {isPresent} from "polar-shared/src/Preconditions";
import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {Heartbeats} from "polar-firebase/src/firebase/om/Heartbeats";
import {IFirestore} from "polar-snapshot-cache/src/store/IFirestore";

export class FirestoreCollections {

    public static async configure(firestore?: IFirestore) {

        firestore = firestore || await Firestore.getInstance();

        // TODO: try to migrate firebaseProvider to async as all the functions
        // should be async...

        for (const firestoreBacked of [SpacedReps, SpacedRepStats, DocPreviews, Heartbeats]) {
            if (isPresent(firestoreBacked.firestoreProvider)) {
                // already configured
                continue;
            }

            firestoreBacked.firestoreProvider = () => firestore as any as FirestoreLike;
        }

    }

}
