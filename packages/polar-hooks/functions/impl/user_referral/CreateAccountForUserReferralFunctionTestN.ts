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

    const emailsToPurge: string[] = [];

    beforeEach(async () => {

        alice = await FirebaseUserCreator.createTestUser('alice');
        bob = FirebaseUserCreator.createTestUserEmail('bob');

        emailsToPurge.push(alice.email);
        emailsToPurge.push(bob);

    });

    afterEach(async () => {
        async function doPurgeUserByEmail(email: string) {
            const firebase = FirebaseAdmin.app();
            const auth = firebase.auth();
            try {
                const user = await auth.getUserByEmail(email);
                await FirebaseUserPurger.doPurge(user.uid);
            } catch (e: any) {
                if (e.errorInfo.code !== 'auth/user-not-found') {
                    console.error(e);
                }
            }
        }

        for (let email of emailsToPurge) {
            await doPurgeUserByEmail(email);
        }
    });

    it('create user with referral', async () => {

        const firestore = FirestoreAdmin.getInstance();

        const userReferral = await UserReferralCollection.get(firestore, alice.uid);

        assert.isDefined(userReferral);

        const user_referral_code = userReferral!.user_referral_code;

        await CreateAccountForUserReferrals.exec({
            email: bob,
            user_referral_code
        }, 'test');

    });

    it.only('GIVEN not a university email THEN an error is returned', async () => {
        const firestore = FirestoreAdmin.getInstance();

        const userReferral = await UserReferralCollection.get(firestore, alice.uid);
        assert.isDefined(userReferral);

        const user_referral_code = userReferral!.user_referral_code;

        const result = await CreateAccountForUserReferrals.exec({
            email: bob,
            user_referral_code
        }, 'test');

        assert.equal(result.code, 'not-university-email');
    });

    it.only('GIVEN a valid university email THEN referral code registration works', async () => {
        const universityAlice = await FirebaseUserCreator.createTestUser('alice', 'harvard.edu');
        const universityBobEmail = FirebaseUserCreator.createTestUserEmail('bob', 'harvard.edu');

        emailsToPurge.push(universityAlice.email);
        emailsToPurge.push(universityBobEmail);

        const firestore = FirestoreAdmin.getInstance();

        const userReferral = await UserReferralCollection.get(firestore, universityAlice.uid);
        assert.isDefined(userReferral);

        const user_referral_code = userReferral!.user_referral_code;

        const result = await CreateAccountForUserReferrals.exec({
            email: universityBobEmail,
            user_referral_code
        }, 'test');

        assert.equal(result.code, 'ok');
    });

});
