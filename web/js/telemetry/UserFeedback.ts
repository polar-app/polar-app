import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {Firestore} from '../firebase/Firestore';
import {Hashcodes} from '../Hashcodes';
import {MachineID} from '../util/MachineIDs';

export class UserFeedbacks {

    public static async write(userFeedback: UserFeedback) {

        const firestore = await Firestore.getInstance();

        const id = Hashcodes.createRandomID();

        const ref = firestore.collection("user_feedback").doc(id);

        await ref.set(userFeedback);

    }

}

interface UserFeedback {

    /**
     * The score they gave us.
     */
    readonly netPromoterScore: NetPromoterScore;

    /**
     * Their actual text that they provided.
     */
    readonly text: string | null;

    readonly created: ISODateTimeString;

    readonly machine: MachineID;

    // TODO: more fields including a unique/blinded ID for the user, the date
    // their account was created (so I can do cohorts for this)

}

type NetPromoterScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

