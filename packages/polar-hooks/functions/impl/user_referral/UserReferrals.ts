import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {StripeCustomers} from "polar-payments-stripe/src/StripeCustomers";
import {StripeTrials} from "polar-payments-stripe/src/StripeTrials";
import {AmplitudeBackendAnalytics} from "polar-amplitude-backend/src/AmplitudeBackendAnalytics";
import {Accounts} from "polar-payments-stripe/src/Accounts";
import {StripeCouponRegistry} from "polar-payments-stripe/src/StripeCouponRegistry";
import {EmailStr} from "polar-shared/src/util/Strings";
import {Billing} from "polar-accounts/src/Billing";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";
import {StripeMode} from "polar-payments-stripe/src/StripeUtils";
import {Plans} from "polar-accounts/src/Plans";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {Testing} from "polar-shared/src/util/Testing";

export namespace UserReferrals {

    import V2PlanPlus = Billing.V2PlanPlus;

    export interface IReferrer {
        readonly uid: UIDStr
        readonly email: EmailStr;
        readonly user_referral_code: string;
    }

    export interface IReferred {
        readonly email: EmailStr;
    }

    async function createNewFirebaseUser(email: EmailStr) {

        console.log(`Creating new firebase user: ${email}...`);

        await FirebaseUserCreator.create(email);

    }

    async function createStripeSubscriptionWithTrial(stripeMode: StripeMode, email: EmailStr, name: string) {

        console.log(`Creating stripe subscription with trial: ${email}...`);

        await StripeCustomers.createCustomer(stripeMode, email, name);

        const trial_end = StripeTrials.computeTrialEnds('30d');

        await StripeCustomers.changePlan(stripeMode, email, V2PlanPlus, 'month', trial_end);

    }

    async function doAmplitudeEvent(stripeMode: StripeMode, user_referral_code: string) {

        console.log("Sending amplitude event...");

        await AmplitudeBackendAnalytics.event2('CreateAccountForUserReferralFunction', {
            stripeMode,
            user_referral_code: user_referral_code
        })
    }

    async function rewardReferringUser(stripeMode: StripeMode, email: EmailStr) {

        console.log(`Rewarding referring user ${email}...`);

        const account = await Accounts.get(email);

        const plan = Plans.toV2(account?.plan).level;

        if (plan === 'free') {

            const trial_end = StripeTrials.computeTrialEnds('30d');

            const customer = await StripeCustomers.getCustomerByEmail(stripeMode, email);

            if (! customer) {
                await StripeCustomers.createCustomer(stripeMode, email, "");
            }

            const subscription = await StripeCustomers.changePlan(stripeMode, email, V2PlanPlus, 'month', trial_end);

            function computeCustomerID() {

                if (typeof subscription.customer === 'string') {
                    return subscription.customer;
                }

                return subscription.customer.id;

            }

            await Accounts.changePlanViaEmail(email, {type: 'stripe', customerID: computeCustomerID()}, plan, 'month');

        } else {

            const couponRegistry = StripeCouponRegistry.get(stripeMode);

            function computeCoupon() {

                switch (plan) {
                    case "free":
                    case "plus":
                        return couponRegistry.PLUS_ONE_MONTH_FREE;
                    case "pro":
                        return couponRegistry.PRO_ONE_MONTH_FREE;
                }

                return couponRegistry.PLUS_ONE_MONTH_FREE;

            }

            const coupon = computeCoupon();

            await StripeCustomers.applyCoupon(stripeMode, email, coupon.id);

        }

    }

    /**
     * Used with our basic referral system.
     *
     * @param stripeMode The mode for stripe to operate.
     * @param referrer The user who referred this user.
     * @param referred The new user account that will be created.  This was the user that was invited.
     */
    export async function createReferredAccountAndApplyRewardToReferrer(stripeMode: StripeMode,
                                                                        referrer: IReferrer,
                                                                        referred: IReferred) {

        if (await isExistingUser(referred.email)) {
            throw new Error(`Can not refer an existing user`);
        }

        await createNewFirebaseUser(referred.email);
        await createStripeSubscriptionWithTrial(stripeMode, referred.email, "");
        await doAmplitudeEvent(stripeMode, referrer.user_referral_code);
        await rewardReferringUser(stripeMode, referrer.email);
        await notifyReferrerByEmailOfFreeUpgrade(referrer.email, referred.email);
    }

    /**
     * This is used to jump the queue and allow two users to invite one another.
     *
     * @param stripeMode The mode for stripe to operate.
     * @param referrer The user who referred this user.
     * @param referred The new user account that will be created.  This was the user that was invited.
     */
    export async function createBothReferrerAndReferred(stripeMode: StripeMode,
                                                        referrer: IReferrer,
                                                        referred: IReferred) {

        async function doCreate(email: string) {
            await createNewFirebaseUser(email);
            await createStripeSubscriptionWithTrial(stripeMode, email, "");
        }

        await doCreate(referrer.email);
        await doCreate(referred.email);

    }

    async function isExistingUser(email: EmailStr) {
        const auth = FirebaseAdmin.app().auth();
        try {
            const existingUser = await auth.getUserByEmail(email);
            return !!existingUser.uid;
        } catch (e) {
            return false;
        }
    }

    async function notifyReferrerByEmailOfFreeUpgrade(referrer: EmailStr, referred: EmailStr) {

        console.log(`Notifying referred of free upgrade: ${referred}...`)

        if (Testing.isTestingRuntime()) {
            return;
        }

        const message = {
            to: referrer,
            from: 'founders@getpolarized.io',
            subject: `Congrats, Polar Plus on us!`,
            html: `<p>Hey there! 👋</p>
                   <p>Congrats, ${referred} has accepted your invite. Enjoy a month of Polar Plus on us 🎉</p>
                   <p>You don’t have to do anything. Your account has automatically been credited the free upgrade.</p>
                   <p>As a reminder, you can get additional months on us by inviting more friends and spreading the word about Polar! 🚀</p>
                   <p>Cheers,</p>
                   <p>The Polar Team</p>
`
        };
        await Sendgrid.send(message);
    }


}
