import {CollectionNameStr, EmailStr, IDStr, UIDStr} from "polar-shared/src/util/Strings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Collections} from "polar-firestore-like/src/Collections";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace UserReferralAttemptCollection {

    import RandomHashcodeStr = Hashcodes.RandomHashcodeStr;

    export type UserReferralAttemptIDStr = RandomHashcodeStr;

    export type UserReferralAttemptStatus = 'started' | 'completed';

    export interface IUserReferralAttemptBase<S extends UserReferralAttemptStatus> {

        readonly id: UserReferralAttemptIDStr;

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

        readonly status: S;

    }

    export type IUserReferralAttemptStarted = IUserReferralAttemptBase<'started'>;
    export type IUserReferralAttemptCompleted = IUserReferralAttemptBase<'completed'>;

    export type IUserReferralAttempt = IUserReferralAttemptStarted | IUserReferralAttemptCompleted;

    export const COLLECTION_NAME: CollectionNameStr = "user_referral_attempt";

    export async function write<SM = unknown>(firestore: IFirestore<SM>, userReferralAttempt: IUserReferralAttempt) {

        const doc = firestore.collection(COLLECTION_NAME)
            .doc(userReferralAttempt.id);

        await doc.set(Dictionaries.onlyDefinedProperties(userReferralAttempt));

    }

    export async function get<SM = unknown>(firestore: IFirestore<SM>, id: UserReferralAttemptIDStr) {
        return await Collections.get<IUserReferralAttempt>(firestore, COLLECTION_NAME, id);
    }

    export async function getByReferredUID<SM = unknown>(firestore: IFirestore<SM>, referred_uid: UIDStr): Promise<IUserReferralAttempt | undefined> {
        return Arrays.first(await Collections.list<IUserReferralAttempt>(firestore, COLLECTION_NAME, [['referred_uid', '==', referred_uid]]));
    }

}
