import {CollectionNameStr, EmailStr, IDStr} from "polar-shared/src/util/Strings";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Collections} from "polar-firestore-like/src/Collections";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace UserReferralCollection {

    // TODO: there are some more issues here
    //
    // - if a user doesn't have an account how do they invite since they don't have a uid
    // - how are rules permissions setup?

    export interface IUserReferral {

        readonly id: UIDStr;

        readonly email: EmailStr;

        readonly uid: UIDStr;

        /**
         * The user referral code that this user uses to invite new users.
         */
        readonly user_referral_code: IDStr;

    }

    export const COLLECTION_NAME: CollectionNameStr = "user_referral";

    export async function write<SM = unknown>(firestore: IFirestore<SM>, userReferral: IUserReferral) {

        const doc = firestore.collection(COLLECTION_NAME)
            .doc(userReferral.id);

        await doc.set(Dictionaries.onlyDefinedProperties(userReferral));

    }

    export async function get<SM = unknown>(firestore: IFirestore<SM>, uid: UIDStr): Promise<IUserReferral | undefined> {
        // return Arrays.first(await Collections.list(firestore, COLLECTION_NAME, [['uid', '==', uid]]));
        return await Collections.get(firestore, COLLECTION_NAME, uid);
    }

    export async function getByReferralCode<SM = unknown>(firestore: IFirestore<SM>, referral_code: IDStr): Promise<IUserReferral | undefined> {
        return Arrays.first(await Collections.list(firestore, COLLECTION_NAME, [['referral_code', '==', referral_code]]));
    }

}
