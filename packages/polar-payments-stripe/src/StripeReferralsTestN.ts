import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
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

        it("Apply coupon to new stripe customer", async function() {

            // TODO: they don't have a payment mechanism here...

            // set payment method for this customer to 'email invoice' with payment page link in the invoice email

            // Since you have chosen to use coupons over a free trial, if the
            // effect of a coupon means no immediate payment is required, the
            // subscription can be created even if the customer has no stored
            // payment method. You can refer to this document for more details:

            // > https://stripe.com/docs/billing/subscriptions/coupons .

            // Be sure to select email invoice under payment method when
            // creating the subscription, and chose to include a payment page
            // link in the invoice email. This will enable the customer to be
            // invoiced to pay the subscription in the next cycle using the
            // payment page after the coupon has expired after the first cycle
            // period.  Review this document for tips on scheduling, creating,
            // or updating a subscription using the Stripe Dashboard:
            //
            // > https://support.stripe.com/questions/create-update-and-schedule-subscriptions .

            await StripeCustomers.createCustomer('test', email, name);

            const trial_end = Math.floor((Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000);

            await StripeCustomers.changePlan('test', email, V2PlanPlus, 'month', trial_end);

        });

    });



});


