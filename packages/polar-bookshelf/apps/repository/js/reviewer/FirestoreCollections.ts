import {Firestore} from "../../../../web/js/firebase/Firestore";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {SpacedRepStats} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import {isPresent} from "polar-shared/src/Preconditions";

export class FirestoreCollections {

    public static async configure() {

        // TODO: dependency injection would rock here.
        const firestore = await Firestore.getInstance();

        for (const firestoreBacked of [SpacedReps, SpacedRepStats]) {
            if (isPresent(firestoreBacked.firestoreProvider)) {
                // already configured
                continue;
            }

            firestoreBacked.firestoreProvider = () => firestore as any as FirestoreLike;
        }

    }
}
