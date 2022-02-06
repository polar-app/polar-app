import {UserIDStr} from "polar-firestore-like/src/IFirestore";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace FirebaseUserUpgrader {

    import IUserReferral = UserReferralCollection.IUserReferral;

    export async function upgrade(uid: UserIDStr) {
        await upgradeUserReferral(uid);
    }

    async function upgradeUserReferral(uid: UserIDStr) {

        const firestore = FirestoreAdmin.getInstance();
        const userReferral = UserReferralCollection.get(firestore, uid);

        if (! userReferral) {

            const referral_code = Hashcodes.createRandomID();

            const userReferral: IUserReferral = {
                id: uid,
                uid,
                referral_code
            }

            await UserReferralCollection.write(firestore, userReferral)

        }

    }

}
