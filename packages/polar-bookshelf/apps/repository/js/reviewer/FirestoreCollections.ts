import {Firestore} from "../../../../web/js/firebase/Firestore";
import {SpacedReps} from "packages/polar-app-public/polar-firebase/src/firebase/om/SpacedRepCollection";
import {SpacedRepStats} from "packages/polar-app-public/polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import {isPresent} from "polar-shared/src/Preconditions";
import {DocPreviews} from "packages/polar-app-public/polar-firebase/src/firebase/om/DocPreviewCollection";
import {Heartbeats} from "packages/polar-app-public/polar-firebase/src/firebase/om/HeartbeatCollection";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";

export class FirestoreCollections {

    public static async configure(firestore?: IFirestoreClient) {

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
