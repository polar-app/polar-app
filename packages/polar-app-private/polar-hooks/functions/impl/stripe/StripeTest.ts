import {assert} from 'chai';
import {StripeUtils} from './StripeUtils';
import Stripe from 'stripe';
import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

const email = "getpolarized.test+test@gmail.com";
process.env.STRIPE_TEST = 'true';

describe('Stripe', function() {

    it("basic", async function() {
        this.timeout(60000);

        const stripe = StripeUtils.getStripe('test');

        let customer = await StripeCustomers.getCustomerByEmail('test', email);

        console.log("Found customer: ", customer);

        if (customer) {
            console.log("Customer already exists...deleting");
            await stripe.customers.del(customer.id);
        }

        customer = await stripe.customers.create({
            email,
            name: "Kevin Burton"
        });

        // NOTE: this is fake information and not a real CC.
        // const source: Stripe.sources.ISourceCreationOptions = {
        //     object: "card",
        //     exp_month: 12,
        //     exp_year: 2050,
        //     cvc: "123",
        //     number: "4242 4242 4242 4242",
        //     name: 'Kevin Burton',
        //     address_line1: '123 Fake Street',
        //     address_city: 'San Francisco',
        //     address_state: 'CA',
        //     address_zip: "94107"
        // };

        const source = "tok_visa";

        const customerSource = await stripe.customers.createSource(customer.id, {
            source
        });

        await StripeCustomers.changePlan('test', email, V2PlanFree, 'month');
        await StripeCustomers.changePlan('test', email, V2PlanPlus, 'month');
        await StripeCustomers.changePlan('test', email, V2PlanPro, 'month');

        // now downgrade...
        await StripeCustomers.changePlan('test', email, V2PlanPlus, 'month');
        await StripeCustomers.changePlan('test', email, V2PlanFree, 'month');

        // make sure we can double set it to bronze, this should be idempotent.
        await StripeCustomers.changePlan('test', email, V2PlanFree, 'month');
        await StripeCustomers.cancelSubscription('test', email);

        // now make sure this customers has no subscriptions after the cancel now.

        const subs = await stripe.subscriptions.list({customer: customer.id});

        assert.equal(subs.data.length, 0 );
        assert.equal(subs.has_more, false);

    });

});


