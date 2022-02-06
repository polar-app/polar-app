import {Hashcodes} from "polar-shared/src/util/Hashcodes";
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

export namespace UserReferrals {

    import V2PlanPlus = Billing.V2PlanPlus;

    export interface IReferrer {
        readonly uid: UIDStr
        readonly email: EmailStr;
        readonly user_referral_code: string;
    }

    export interface IReferred {
        readonly email: EmailStr;
        readonly name: string;
    }

    /**
     *
     * @param referrer The user who referred this user.
     * @param referred The new user account that will be created.  This was the user that was invited.
     */
    export async function createNewAccountAndApplyReward(stripeMode: StripeMode,
                                                         referrer: IReferrer,
                                                         referred: IReferred) {

        async function createNewFirebaseUser() {

            const password = Hashcodes.createRandomID();
            await FirebaseUserCreator.create(referred.email, password);

        }

        async function createStripeSubscriptionWithTrial() {

            await StripeCustomers.createCustomer(stripeMode, referred.email, referred.name);

            const trial_end = StripeTrials.computeTrialEnds('30d');

            await StripeCustomers.changePlan(stripeMode, referred.email, V2PlanPlus, 'month', trial_end);

        }

        async function doAmplitudeEvent() {
            await AmplitudeBackendAnalytics.event2('CreateAccountForUserReferralFunction', {
                stripeMode,
                user_referral_code: referrer.user_referral_code
            })
        }

        async function rewardReferringUser() {

            const account = await Accounts.get(referrer.email);

            const plan = account?.plan || 'free';

            if (plan === 'free') {

                const trial_end = StripeTrials.computeTrialEnds('30d');
                const subscription = await StripeCustomers.changePlan(stripeMode, referrer.email, V2PlanPlus, 'month', trial_end);

                function computeCustomerID() {

                    if (typeof subscription.customer === 'string') {
                        return subscription.customer;
                    }

                    return subscription.customer.id;

                }

                await Accounts.changePlanViaEmail(referrer.email, {type: 'stripe', customerID: computeCustomerID()}, plan, 'month');

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

                await StripeCustomers.applyCoupon(stripeMode, referrer.email, coupon.id);

            }

        }

        await createNewFirebaseUser();
        await createStripeSubscriptionWithTrial();
        await doAmplitudeEvent();
        await rewardReferringUser();

    }

}
