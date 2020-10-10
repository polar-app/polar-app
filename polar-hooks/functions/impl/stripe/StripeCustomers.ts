import Stripe from "stripe";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {Billing} from 'polar-accounts/src/Billing';
import {StripePlanIDs} from "./StripePlanIDs";
import {IDStr} from "polar-shared/src/util/Strings";
import {isPresent} from "polar-shared/src/Preconditions";

export interface StripeCustomerSubscription {
    readonly customer: Stripe.Customer;
    readonly subscription?: Stripe.Subscription;
}

export interface StripeCustomerSubscriptions {
    readonly customer: Stripe.Customer;
    readonly subscriptions: ReadonlyArray<Stripe.Subscription>;
}

export namespace StripeCustomers {

    export async function setDefaultPaymentMethod(mode: StripeMode, customerID: IDStr) {

        const stripe = StripeUtils.getStripe(mode);
        const customer = await stripe.customers.retrieve(customerID);

        if (customer.deleted) {
            throw new Error("Customer is deleted");
        } else {

            if (isPresent(customer.default_source)) {
                // we already have a default source so we're done
                return;
            }

            if (customer.sources && customer.sources.data.length === 1){

                const sourceID = customer.sources.data[0].id;

                const update = {
                    default_source: sourceID
                }

                await stripe.customers.update(customer.id, update);
            }

        }

    }

    export async function getCustomerByEmail(mode: StripeMode, email: string): Promise<Stripe.Customer | undefined> {

        const stripe = StripeUtils.getStripe(mode);

        const opts = {email};

        const customers = await stripe.customers.list(opts);

        if (customers.data.length === 0) {
            return undefined;
        }

        const nrRecords = customers.data.length;

        if (nrRecords > 1) {
            throw new Error(`Too many records (${nrRecords}) for customer in stripe: ${email}`);
        }

        return customers.data[0];

    }

    export async function getCustomerSubscription(mode: StripeMode,
                                                  email: string): Promise<StripeCustomerSubscription> {

        const customer = await getCustomerByEmail(mode, email);

        if (! customer) {
            throw new Error("No customer for email: " + email);
        }

        if (customer.subscriptions === undefined) {
            console.log("No subscriptions (subscriptions was undefined)");
            return {customer};
        }

        if (customer.subscriptions.data.length === 0) {
            console.log("No subscriptions (subscriptions array empty)");
            return {customer};
        }

        const activeSubscriptions
            = customer.subscriptions.data.filter(current => current.status === 'active');

        if (activeSubscriptions.length === 0) {
            console.log("No active subscriptions");
            return {customer};
        }

        if (activeSubscriptions.length !== 1) {
            const msg = `Too many subscriptions for ${email}: ${activeSubscriptions.length}`;
            console.warn(activeSubscriptions);
            throw new Error(msg + email);
        }

        const subscription = activeSubscriptions[0];

        return {customer, subscription};

    }

    export async function getActiveCustomerSubscriptions(mode: StripeMode,
                                                         email: string): Promise<StripeCustomerSubscriptions> {

        const customer = await getCustomerByEmail(mode, email);

        if (! customer) {
            throw new Error("No customer for email: " + email);
        }

        if (! customer.subscriptions || customer.subscriptions.data.length === 0) {
            // we have a customer just no subscription yet
            return {customer, subscriptions: []};
        }

        const subscriptions
            = customer.subscriptions.data.filter(current => current.status === 'active');

        return {customer, subscriptions};

    }

    export async function cancelActiveCustomerSubscriptions(mode: StripeMode, email: string): Promise<void> {
        const customerSubscriptions = await getActiveCustomerSubscriptions(mode, email);

        const stripe = StripeUtils.getStripe(mode);

        for (const subscription of customerSubscriptions.subscriptions) {
            await stripe.subscriptions.del(subscription.id);
        }

    }

    export async function changePlan(mode: StripeMode,
                                     email: string,
                                     plan: Billing.V2Plan,
                                     interval: Billing.Interval) {

        console.log(`Changing plan for ${email} to ${plan.level}`);

        const customerSubscription = await getCustomerSubscription(mode, email);

        const planID = StripePlanIDs.fromSubscription(mode, plan, interval);

        const stripe = StripeUtils.getStripe(mode);

        const {customer, subscription} = customerSubscription;

        if (subscription) {

            console.log(`Updating subscription ${subscription.id} to plan ID ${planID} AKA ${plan.level} using mode ${mode}`);

            // note that proration is the default behavior now:
            // https://stripe.com/docs/billing/subscriptions/prorations
            //
            // Prorating is the default behavior, but you can disable it by setting proration_behavior to none:

            await stripe.subscriptions.update(subscription.id, {
                items: [
                    {
                        id: subscription.items.data[0].id,
                        plan: planID
                    }
                ]
            });

        } else {

            console.log(`Creating new subscription for plan ID ${planID} AKA ${plan.level} using mode ${mode}`);

            await stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    plan: planID
                }]
            });
        }

    }

    export async function cancelSubscription(mode: StripeMode,
                                             email: string) {

        const stripe = StripeUtils.getStripe(mode);
        const customerSubscription = await getCustomerSubscription(mode, email);
        const {customer, subscription} = customerSubscription;

        if (!subscription) {
            // we are already done. no subscription.
            return;
        }

        await stripe.subscriptions.del(subscription.id);

        // TODO: right now we MUST delete the customer because when checkout
        // kicks in again we get another customer with the same email.
        await stripe.customers.del(customer.id);

    }

    export async function applyCoupon(mode: StripeMode,
                                      email: string,
                                      coupon: string) {

        const stripe = StripeUtils.getStripe(mode);

        const customerSubscription = await getCustomerSubscription(mode, email);
        const {customer, subscription} = customerSubscription;

        if (!subscription) {
            // we are already done. no subscription.
            return;
        }

        await stripe.subscriptions.update(subscription.id, {coupon});

    }

}
