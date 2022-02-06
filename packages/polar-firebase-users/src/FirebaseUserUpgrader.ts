import {UserIDStr} from "polar-firestore-like/src/IFirestore";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {AccountCollection} from "polar-firebase/src/firebase/om/AccountCollection";

export namespace FirebaseUserUpgrader {

    import IUserReferral = UserReferralCollection.IUserReferral;

    export async function upgrade(uid: UserIDStr) {
        await upgradeUserReferral(uid);
        await doAccountUpgrade(uid);
    }

    async function doAccountUpgrade(uid: UserIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        await AccountCollection.upgrade(firestore, uid, 'v2');

    }

    async function upgradeUserReferral(uid: UserIDStr) {

        const firestore = FirestoreAdmin.getInstance();
        const userReferral = await UserReferralCollection.get(firestore, uid);

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
