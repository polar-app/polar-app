import {UserIDStr} from "polar-firestore-like/src/IFirestore";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {AccountCollection} from "polar-firebase/src/firebase/om/AccountCollection";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {EmailStr} from "polar-shared/src/util/Strings";

export namespace FirebaseUserUpgrader {

    import IUserReferral = UserReferralCollection.IUserReferral;

    export async function upgrade(uid: UserIDStr) {

        async function getUserEmail() {
            const firebase = FirebaseAdmin.app();
            const user = await firebase.auth().getUser(uid);
            return user.email!;
        }

        const email = await getUserEmail();

        await upgradeUserReferral(uid, email);
        await doAccountUpgrade(uid, email);

    }

    async function doAccountUpgrade(uid: UserIDStr, email: EmailStr) {
        const firestore = FirestoreAdmin.getInstance();
        await AccountCollection.upgrade(firestore, uid, email, 'v2');

    }

    async function upgradeUserReferral(uid: UserIDStr, email: EmailStr) {

        const firestore = FirestoreAdmin.getInstance();
        const userReferral = await UserReferralCollection.get(firestore, uid);

        if (! userReferral) {

            const user_referral_code = Hashcodes.createRandomID();

            const userReferral: IUserReferral = {
                id: uid,
                email,
                uid,
                user_referral_code
            }

            await UserReferralCollection.write(firestore, userReferral)

        }

    }

}
