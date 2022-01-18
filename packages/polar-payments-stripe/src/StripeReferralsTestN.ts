import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import {StripeTrials} from "./StripeTrials";
import {StripeCouponRegistry} from "./StripeCouponRegistry";
import V2PlanPlus = Billing.V2PlanPlus;

describe('StripeReferrals', function() {

    // we need to test the following:
    //
    // 1. Apply a coupon to an existing subscription
    //
    //

    const email = 'alice+stripetest@getpolarized.io';
    const name = "Alice Smith";

    describe('new customer', () => {

        beforeEach(async () => {

            const customer = await StripeCustomers.getCustomerByEmail('test', email);

            if (customer) {
                await StripeCustomers.cancelSubscription('test', email);
            }

        });

        xit("Create new customer with a 30d trial.", async function() {

            await StripeCustomers.createCustomer('test', email, name);

            const trial_end = StripeTrials.computeTrialEnds('30d');

            await StripeCustomers.changePlan('test', email, V2PlanPlus, 'month', trial_end);

        });

        it("Create new customer with a 30d trial and apply coupon", async function() {

            await StripeCustomers.createCustomer('test', email, name);

            const trial_end = StripeTrials.computeTrialEnds('30d');

            await StripeCustomers.changePlan('test', email, V2PlanPlus, 'month', trial_end);

            const couponRegistry = StripeCouponRegistry.get('test');

            await StripeCustomers.applyCoupon('test', email, couponRegistry.PLUS_ONE_MONTH_FREE.id);

        });

    });



});


