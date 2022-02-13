// TODO:
// create alice/bob pair
// get alice's referral code
// create bob's account
//

import {EmailStr} from "polar-shared/src/util/Strings";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {assert} from 'chai';
import {CreateAccountForUserReferrals} from "./CreateAccountForUserReferrals";
import {FirebaseUserPurger} from "polar-firebase-users/src/FirebaseUserPurger";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import IFirebaseUserRecord = FirebaseUserCreator.IFirebaseUserRecord;

describe('CreateAccountForUserReferralFunction', () => {

    let alice: IFirebaseUserRecord = null!;
    let bob: EmailStr = ''

    beforeEach(async () => {

        alice = await FirebaseUserCreator.createTestUser('alice');
        bob = await FirebaseUserCreator.createTestUserEmail('bob');

    });

    afterEach(async () => {

        async function doPurgeAlice() {
            await FirebaseUserPurger.doPurge(alice.uid);
        }

        async function doPurgeBob() {

            const firebase = FirebaseAdmin.app();
            const auth = firebase.auth();

            try {
                const user = await auth.getUserByEmail(bob);
                await FirebaseUserPurger.doPurge(user.uid);
            } catch (e) {

            }

        }

        await doPurgeAlice();
        await doPurgeBob();

    });

    it('create user with referral', async () => {

        const firestore = FirestoreAdmin.getInstance();

        const userReferral = await UserReferralCollection.get(firestore, alice.uid);

        assert.isDefined(userReferral);

        const user_referral_code = userReferral!.user_referral_code;

        await CreateAccountForUserReferrals.exec({
            email: bob,
            user_referral_code
        });

    });

});
