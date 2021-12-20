import {SpacedRepStatCollection, StatType} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export class ReviewerStatistics {

    /**
     * @deprecated
     */
    public static async statistics(mode: RepetitionMode, type: StatType) {

        const uid = await FirebaseBrowser.currentUserID();
        const firestore = await FirestoreBrowserClient.getInstance();

        if (! uid) {
            // TODO no way to know that we're not authenticated
            return [];
        }

        const records = await SpacedRepStatCollection.list(firestore, uid, mode, type);
        // TODO: we should return 1 week or N records, max.

        return records;

    }

}
