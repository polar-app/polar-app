import {CollectionNameStr, EmailStr, IDStr, UIDStr} from "polar-shared/src/util/Strings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace UserReferralCompletedCollection {

    import RandomHashcodeStr = Hashcodes.RandomHashcodeStr;

    export interface IUserReferralCompleted {

        readonly id: RandomHashcodeStr;

        readonly ver: 'v1',

        readonly completed: ISODateTimeString;
        /**
         * The user referral code used.
         */
        readonly user_referral_code: IDStr;

        readonly referrer_uid: UIDStr;
        readonly referrer_email: EmailStr;

        readonly referred_uid: EmailStr;
        readonly referred_email: EmailStr;

    }

    export const COLLECTION_NAME: CollectionNameStr = "user_referral_completed";

    export async function write<SM = unknown>(firestore: IFirestore<SM>, userReferralCompleted: IUserReferralCompleted) {

        const doc = firestore.collection(COLLECTION_NAME)
            .doc(userReferralCompleted.id);

        await doc.set(Dictionaries.onlyDefinedProperties(userReferralCompleted));

    }


}
