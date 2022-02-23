import {expect} from "chai";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {UserReferrals} from "./UserReferrals";
import {StripeCustomers} from "polar-payments-stripe/src/StripeCustomers";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {StripePlanIDs} from "polar-payments-stripe/src/StripePlanIDs";
import {Billing} from "polar-accounts/src/Billing";
import {StripeUtils} from "polar-payments-stripe/src/StripeUtils";
import {StripeCouponRegistry} from "polar-payments-stripe/src/StripeCouponRegistry";
import {Accounts} from "polar-payments-stripe/src/Accounts";
import {FirebaseUserPurger} from "polar-firebase-users/src/FirebaseUserPurger";
import {Arrays} from "polar-shared/src/util/Arrays";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

describe('UserReferrals', () => {

    // UIDs pushed here will be deleted from Firebase Auth in afterEach()
    const tmpUserEmails: string[] = [];

    const auth = FirebaseAdmin.app().auth();
    const firestore = FirestoreAdmin.getInstance();
    const stripe = StripeUtils.getStripe('test');

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
        await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

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

    it('Alice (free member) invites Bob and Alice receives a free month of Plus in Stripe', async function () {
        // Stripe subscriptions seem to provide "eventual consistency" or something, rendering this test Flaky sometimes
        // so retry it 3 times before considering it as failed
        this.retries(3);

        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

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

        // Alice started a trial
        expect(firstSubscription).not.undefined;
        expect(firstSubscription?.status).eq('trialing', 'Subscription status of Alice is not "trialing"');

        const now = new Date().getTime() / 1000;
        const in30Days = now + 30 * 24 * 60 * 60;

        // Alice's trial is 30 days
        expect(firstSubscription?.trial_start).lessThan(now, 'Trial start date is not in the past');
        expect(firstSubscription?.trial_end).approximately(in30Days, 100, 'Trial end date is either far below or far above 30 days from now');

        // Current plan of Alice is Plus
        const stripePlanPlusId = StripePlanIDs.fromSubscription('test', V2PlanPlus.level, 'month');
        expect(firstSubscription?.items.data.find(() => true)?.price.id).eq(stripePlanPlusId);
    });


    it('Alice created as Plus member is indeed a Plus member in Stripe', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');

        // Register Alice
        await createUser(emailOfAlice);

        // Create a Stripe customer
        const stripeCustomerAlice = await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Setup default payment method. Required to switch to a non-free plan
        await setupDefaultPaymentMethod(stripeCustomerAlice.id);

        // Switch Alice to the Plus plan
        await StripeCustomers.changePlan('test', emailOfAlice, V2PlanPlus, 'month');

        // Fetch first active subscription from Stripe
        const subscriptions = await StripeCustomers.getCustomerSubscriptions('test', emailOfAlice);
        const firstSubscription = subscriptions.subscriptions.find(() => true);

        // Check if current plan of Alice in Stripe is Plus
        const stripePlanPlusId = StripePlanIDs.fromSubscription('test', V2PlanPlus.level, 'month');
        expect(firstSubscription?.items.data.find(() => true)?.price.id).eq(stripePlanPlusId);
    });

    it('Alice (plus member) invites Bob and receives a free +1 month extension of her plan', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        const stripeCustomerAlice = await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Configure a default payment method for Alice
        const customer = stripeCustomerAlice.id;
        await setupDefaultPaymentMethod(customer);

        // Switch Alice to the Plus plan initially (this requires a default payment to be set up above)
        await StripeCustomers.changePlan('test', emailOfAlice, V2PlanPlus, 'month');

        // Get the referral code for Alice
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        const user_referral_code = referralCodeDocument?.user_referral_code as string;

        const emailOfBob = getRandomEmail('bob');
        tmpUserEmails.push(emailOfBob);
        await UserReferrals.createReferredAccountAndApplyRewardToReferrer("test", {
            uid: alice.uid,
            email: alice.email!,
            user_referral_code,
        }, {
            email: emailOfBob,
        });

        // Fetch Subscription of Alice from Stripe
        const subscriptions = await StripeCustomers.getCustomerSubscriptions('test', emailOfAlice);

        expect(subscriptions.subscriptions.length).to.be.eq(1);

        const firstSubscription = Arrays.first(subscriptions.subscriptions);

        // Check if Alice has a discount coupon applied
        expect(firstSubscription?.discount?.coupon.id).to.not.be.undefined;

        expect(firstSubscription?.discount?.coupon.id).eq(StripeCouponRegistry.get('test').PLUS_ONE_MONTH_FREE.id);

    });

    it('Alice (pro member) invites Bob and receives a free +1 month extension of her plan', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        const stripeCustomerAlice = await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Configure a default payment method for Alice
        const customer = stripeCustomerAlice.id;
        await setupDefaultPaymentMethod(customer);

        // Switch Alice to the Plus plan initially (this requires a default payment to be set up above)
        await StripeCustomers.changePlan('test', emailOfAlice, V2PlanPro, 'month');
        await Accounts.changePlanViaEmail(emailOfAlice, {type: 'stripe', customerID: customer}, V2PlanPro, 'month');

        // Get the referral code for Alice
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        const user_referral_code = referralCodeDocument?.user_referral_code as string;

        const emailOfBob = getRandomEmail('bob');
        tmpUserEmails.push(emailOfBob);
        await UserReferrals.createReferredAccountAndApplyRewardToReferrer("test", {
            uid: alice.uid,
            email: alice.email!,
            user_referral_code,
        }, {
            email: emailOfBob,
        });

        // Fetch Subscription of Alice from Stripe
        const subscriptions = await StripeCustomers.getCustomerSubscriptions('test', emailOfAlice);
        const firstSubscription = subscriptions.subscriptions.find(() => true);

        // Check if Alice has a discount coupon applied
        expect(firstSubscription?.discount?.coupon.id).eq(StripeCouponRegistry.get('test').PRO_ONE_MONTH_FREE.id);
    });

    it('Alice invites Bob but Bob was already a member, so it should fail and Alice gets nothing', async () => {
        // Setup Alice
        const emailOfAlice = getRandomEmail('alice');
        const alice = await createUser(emailOfAlice);
        const stripeCustomerAlice = await StripeCustomers.getOrCreateCustomer('test', emailOfAlice, `Alice ${emailOfAlice}`);

        // Configure a default payment method for Alice
        const customer = stripeCustomerAlice.id;
        await setupDefaultPaymentMethod(customer);

        // Switch Alice to the Plus plan initially (this requires a default payment to be set up above)
        await StripeCustomers.changePlan('test', emailOfAlice, V2PlanPro, 'month');
        await Accounts.changePlanViaEmail(emailOfAlice, {type: 'stripe', customerID: customer}, V2PlanPro, 'month');

        // Get the referral code for Alice
        const referralCodeDocument = await UserReferralCollection.get(firestore, alice.uid);
        const user_referral_code = referralCodeDocument?.user_referral_code as string;

        const emailOfBob = getRandomEmail('bob');
        const bob = await createUser(emailOfBob);

        try {
            await UserReferrals.createReferredAccountAndApplyRewardToReferrer("test", {
                uid: alice.uid,
                email: alice.email!,
                user_referral_code,
            }, {
                email: bob.email!,
            });
            expect.fail('Referring an existing user should have throw an error to this point');
        } catch (e: any) {
            expect((e as Error).message).to.include('Can not refer an existing user');
        }

        // Fetch Subscription of Alice from Stripe
        const subscriptions = await StripeCustomers.getCustomerSubscriptions('test', emailOfAlice);
        const firstSubscription = subscriptions.subscriptions.find(() => true);

        expect(
            firstSubscription?.discount,
            'Alice has a promo code in subscription but she should not. Bob was an existing member when she invited him'
        ).null;
    });
    xit('Alice invites 2 different Bobs and receives 2 months of Plus extension', async () => {
        // @TODO Just updating the Stripe subscription with the same coupon code DOES NOT seem to mean the next 2 subscriptions will be free?
    });
    xit('Alice (not a member) and Bob (not a member) both become members when Bob accepts invite by Alice', async () => {
        // @TODO We'll focus on this a bit later, after the basic version of the Referral system is out
        // @TODO Reason being: the existing "user_referral_codes" collection requires a Firebase auth UID but in THIS
        // @TODO scenario specifically we want Alice to invite Bob BEFORE she herself is even a member
        // @TODO So this scenarios probably requires some restructuring of the existing collection or a new collection


        // @TODO Test UserReferrals.createBothReferrerAndReferred() here
    });

    /**
     * If you pass a suffix "alice" this will generate an email like: testing+alice1644614307-ebbpi@getpolarized.io
     */
    const getRandomEmail = (hint?: string) => {
        return FirebaseUserCreator.createTestUserEmail(hint)
    }

    /**
     * Create a dummy Firebase auth user and corresponding Account document in Firestore
     */
    const createUser = async (email: string) => {
        console.log(`Creating dummy Firebase auth user with email ${email}...`);
        const user = await FirebaseUserCreator.create(email);
        console.log(`Creating dummy Firebase auth user with email ${email}... Done. UID is ${user.uid}`);
        tmpUserEmails.push(user.email as string);
        return user;
    }

    /**
     * Create a dummy Payment Method in Stripe and attach it to the provided Stripe customer
     * @param customer
     */
    async function setupDefaultPaymentMethod(customer: string) {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 12,
                exp_year: new Date().getUTCFullYear() + 3,
                cvc: '123',
            },
        });
        await stripe.paymentMethods.attach(paymentMethod.id, {customer})
        await stripe.customers.update(customer, {
            invoice_settings: {default_payment_method: paymentMethod.id},
        });
    }

    afterEach(async () => {
        for (let tmpUserEmail of tmpUserEmails) {

            async function doUserDelete() {

                try {
                    const user = await auth.getUserByEmail(tmpUserEmail);

                    await FirebaseUserPurger.doPurge(user.uid)
                    console.log(`Firebase auth user with email ${tmpUserEmail} deleted`);

                } catch (e: any) {
                    if (e.errorInfo.code === 'auth/user-not-found') {
                        // User already deleted, probably inside the it() function. Just skip it
                        return;
                    }
                    console.error(e);
                    console.error(`Failed to cleanup Firebase auth user with email ${tmpUserEmail}`);
                }


            }

            async function doStripeDelete() {

                try {
                    // Also delete the Stripe customer, if exists
                    const stripeCustomerExists = await StripeCustomers.getCustomerByEmail('test', tmpUserEmail);
                    if (stripeCustomerExists?.id) {
                        await StripeCustomers.deleteCustomer('test', tmpUserEmail);
                    }
                    console.log(`Stripe customer for email ${tmpUserEmail} deleted`);
                } catch (e) {
                    console.error(e);
                    console.error(`Failed to delete Stripe customer for email ${tmpUserEmail}`);
                }

            }

            await doUserDelete();
            await doStripeDelete();

        }
    });
})
