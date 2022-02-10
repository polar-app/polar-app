import {expect} from "chai";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {UserReferrals} from "./UserReferrals";
import {StripeCustomers} from "polar-payments-stripe/src/StripeCustomers";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

describe('UserReferrals', () => {

    // UIDs pushed here will be deleted from Firebase Auth in afterEach()
    const tmpUserEmails: string[] = [];
    const auth = FirebaseAdmin.app().auth();
    const firestore = FirestoreAdmin.getInstance();

    const getRandomEmail = (suffix?: string) => {
        const alias = suffix ? `${suffix}-` : '';
        return `testing+${alias}${Math.round(new Date().getTime() / 1000)}-${Hashcodes.createRandomID({len: 5}).toLowerCase()}@getpolarized.io`
    }

    const createUser = async (email: string) => {
        const password = Hashcodes.createRandomID();
        console.log(`Creating dummy Firebase auth user with email ${email}...`);
        const user = await FirebaseUserCreator.create(email);
        console.log(`Creating dummy Firebase auth user with email ${email}... Done. UID is ${user.uid}`);
        tmpUserEmails.push(user.email as string);
        return user;
    }

    it('Can register Alice and Bob', async () => {
        const alice = await createUser(getRandomEmail());
        const bob = await createUser(getRandomEmail());

        const aliceAssertion = await auth.getUserByEmail(alice.email as string);
        expect(aliceAssertion.uid).not.empty;
        const bobAssertion = await auth.getUserByEmail(bob.email as string);
        expect(bobAssertion.uid).not.empty;
    });

    it('Alice has a referral code when she is registered', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);

        // Get the referral code for Alice and assert it's there
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        expect(referralCodeDocument?.user_referral_code).not.empty;
    });

    it('Alice invites Bob and Bob can become a member', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        await StripeCustomers.createCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Setup Bob
        const emailOfBob = getRandomEmail('bob');
        tmpUserEmails.push(emailOfBob);

        // Get the referral code for Alice
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        const user_referral_code = referralCodeDocument?.user_referral_code as string;

        await UserReferrals.createReferredAccountAndApplyRewardToReferrer("test", {
            uid: alice.uid,
            email: alice.email!,
            user_referral_code,
        }, {email: emailOfBob});

        const user = await auth.getUserByEmail(emailOfBob);
        expect(user.email!).eq(emailOfBob, 'Bob was not auto-created in Firebase Auth after accepting invite by Alice');
    });

    it('Alice (free member) invites Bob and Alice receives a free month of Plus in Stripe', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        await StripeCustomers.createCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Setup Bob
        const emailOfBob = getRandomEmail('bob');
        tmpUserEmails.push(emailOfBob);

        // Get the referral code for Alice
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        const user_referral_code = referralCodeDocument?.user_referral_code as string;

        await UserReferrals.createReferredAccountAndApplyRewardToReferrer("test", {
            uid: alice.uid,
            email: alice.email!,
            user_referral_code,
        }, {
            email: emailOfBob,
        });

        // Assertions

        // Alice has a Stripe subscription that's started
        const subscriptions = await StripeCustomers.getCustomerSubscriptions('test', emailOfAlice);
        const firstSubscription = subscriptions.subscriptions.find(() => true);
        expect(firstSubscription).not.undefined;
        expect(firstSubscription?.status).eq('trialing', 'Subscription status of Alice is not "trialing"');
        const now = new Date().getTime() / 1000;
        const in30Days = now + 30 * 24 * 60 * 60;
        expect(firstSubscription?.trial_start).lessThan(now, 'Trial start date is not in the past');
        expect(firstSubscription?.trial_end).approximately(in30Days, 100, 'Trial end date is either far below or far above 30 days from now');
    });

    xit('Alice (plus member) invites Bob and receives a free +1 month extension of her plan', async () => {
    });
    xit('Alice (pro member) invites Bob and receives a free +1 month extension of her plan', async () => {
    });
    xit('Alice invites Bob but Bob was already a member so Alice gets nothing', async () => {
    });
    xit('Alice invites 2 different Bobs and receives 2 months of Plus extension', async () => {
    });
    xit('Alice (not a member) and Bob (not a member) both become members when Bob accepts Alice\'s invite', async () => {
        // UserReferrals.createBothReferrerAndReferred()
    })

    afterEach(async () => {
        if (tmpUserEmails.length) {
            for (let tmpUserEmail of tmpUserEmails) {
                try {
                    const user = await auth.getUserByEmail(tmpUserEmail);
                    await auth.deleteUser(user.uid);
                    console.log(`Firebase auth user with email ${tmpUserEmail} deleted`);
                } catch (e: any) {
                    if (e.errorInfo.code === 'auth/user-not-found') {
                        // User already deleted, probably inside the it() function. Just skip it
                        continue;
                    }
                    console.error(e);
                    console.error(`Failed to cleanup Firebase auth user with email ${tmpUserEmail}`);
                }

                try {

                    // Also delete the Stripe customer, if exists
                    const stripeCustomerExists = await StripeCustomers.getCustomerByEmail('test', tmpUserEmail);
                    if (stripeCustomerExists?.id) {
                        await StripeCustomers.deleteCustomer('test', stripeCustomerExists.id);
                    }
                } catch (e) {
                    console.error(`Failed to delete Stripe customer for email ${tmpUserEmail}`);
                }
            }
        }
    });
})
