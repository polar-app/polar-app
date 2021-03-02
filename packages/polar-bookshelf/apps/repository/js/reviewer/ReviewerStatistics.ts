import {SpacedRepStats, StatType} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FirestoreCollections} from "./FirestoreCollections";

export class ReviewerStatistics {

    public static async statistics(mode: RepetitionMode, type: StatType) {

        await FirestoreCollections.configure();

        const uid = await Firebase.currentUserID();

        if (! uid) {
            // TODO no way to know that we're not authenticated
            return [];
        }

        const records = await SpacedRepStats.list(uid, mode, type);
        // TODO: we should return 1 week or N records, max.

        return records;

    }

}
