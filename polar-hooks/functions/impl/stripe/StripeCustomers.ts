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

    export async function setDefaultPaymentMethod(stripeMode: StripeMode, customerID: IDStr) {

        const stripe = StripeUtils.getStripe(stripeMode);
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

    interface CustomerQueryByID {
        readonly id: string;
    }

    type EmailStr = string;
    type CustomerQuery = EmailStr | CustomerQueryByID;

    // TODO should be getCustomer
    export async function getCustomerByEmail(stripeMode: StripeMode,
                                             query: CustomerQuery): Promise<Stripe.Customer | undefined> {

        const stripe = StripeUtils.getStripe(stripeMode);

        if (typeof query === 'string') {

            const email = query;
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

        } else {

            const retrieved = await stripe.customers.retrieve(query.id);

            if (retrieved.deleted) {
                throw new Error("Customer is deleted: " + query.id);
            }

            return retrieved;

        }

    }

    interface CustomerSubscriptionsFilter {
        readonly status?: "active";
    }

    export async function getCustomerSubscriptions(stripeMode: StripeMode,
                                                   customerQuery: CustomerQuery,
                                                   filter: CustomerSubscriptionsFilter = {}): Promise<StripeCustomerSubscriptions> {

        const customer = await getCustomerByEmail(stripeMode, customerQuery);

        if (! customer) {
            throw new Error("No customer for email: " + JSON.stringify(customerQuery));
        }

        const stripe = StripeUtils.getStripe(stripeMode);

        const subscriptions = await stripe.subscriptions.list({customer: customer.id, ...filter});

        if (subscriptions === undefined) {
            console.log("No subscriptions (subscriptions was undefined)");
            return {customer, subscriptions: []};
        }

        const nrSubscriptions = subscriptions.data.length;

        if (nrSubscriptions === 0) {
            console.log("No subscriptions (subscriptions array empty)");
            return {customer, subscriptions: []};
        }

        return {customer, subscriptions: [...subscriptions.data]};

    }

    export async function getActiveCustomerSubscriptions(stripeMode: StripeMode,
                                                         customerQuery: CustomerQuery): Promise<StripeCustomerSubscriptions> {

        return await getCustomerSubscriptions(stripeMode, customerQuery, {status: 'active'});

    }

    export async function getActiveCustomerSubscription(stripeMode: StripeMode,
                                                        email: string): Promise<StripeCustomerSubscription> {

        const {customer, subscriptions} = await getActiveCustomerSubscriptions(stripeMode, email);

        const nrSubscriptions = subscriptions.length;

        if (nrSubscriptions > 1) {
            const msg = `Too many subscriptions for ${email}: ${nrSubscriptions}`;
            console.warn(msg);
            throw new Error(msg);
        }

        return {customer, subscription: subscriptions[0]}

    }

    interface DeleteCustomerSubscriptionsFilter {
        readonly except?: IDStr;
    }

    export async function deleteCustomerSubscriptions(stripeMode: StripeMode,
                                                      customerQuery: CustomerQuery,
                                                      filter: DeleteCustomerSubscriptionsFilter = {}): Promise<void> {

        const customerSubscriptions = await getCustomerSubscriptions(stripeMode, customerQuery);

        function filterExcept(current: Stripe.Subscription) {

            if (isPresent(filter.except)) {
                return current.id !== filter.except;
            } else {
                return true;
            }

        }

        const subscriptions = customerSubscriptions.subscriptions.filter(filterExcept);

        const stripe = StripeUtils.getStripe(stripeMode);

        console.log("Deleting N subscriptions: " + subscriptions.length);

        for (const subscription of subscriptions) {
            await stripe.subscriptions.del(subscription.id);
            console.log("Delete subscription: " + subscription.id);
        }

    }

    export async function changePlan(stripeMode: StripeMode,
                                     email: string,
                                     plan: Billing.V2Plan,
                                     interval: Billing.Interval) {

        console.log(`Changing plan for ${email} to ${plan.level}`);

        const customerSubscription = await getActiveCustomerSubscription(stripeMode, email);

        const planID = StripePlanIDs.fromSubscription(stripeMode, plan, interval);

        const stripe = StripeUtils.getStripe(stripeMode);

        const {customer, subscription} = customerSubscription;

        if (subscription) {

            console.log(`Updating subscription ${subscription.id} to plan ID ${planID} AKA ${plan.level} using mode ${stripeMode}`);

            // note that proration is the default behavior now:
            // https://stripe.com/docs/billing/subscriptions/prorations
            //
            // Prorating is the default behavior, but you can disable it by setting proration_behavior to none:

            if (interval === '4year') {
                throw new Error("We do not support 4 year plans with 'change plan'");
            } else {

                await stripe.subscriptions.update(subscription.id, {
                    items: [
                        {
                            id: subscription.items.data[0].id,
                            plan: planID
                        }
                    ]
                });

            }


        } else {

            console.log(`Creating new subscription for plan ID ${planID} AKA ${plan.level} using mode ${stripeMode}`);

            await stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    plan: planID
                }]
            });
        }

    }

    export async function cancelSubscription(stripeMode: StripeMode,
                                             email: string) {

        const stripe = StripeUtils.getStripe(stripeMode);
        const customerSubscription = await getActiveCustomerSubscription(stripeMode, email);
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

    export async function applyCoupon(stripeMode: StripeMode,
                                      email: string,
                                      coupon: string) {

        const stripe = StripeUtils.getStripe(stripeMode);

        const customerSubscription = await getActiveCustomerSubscription(stripeMode, email);
        const {customer, subscription} = customerSubscription;

        if (!subscription) {
            // we are already done. no subscription.
            return;
        }

        await stripe.subscriptions.update(subscription.id, {coupon});

    }

}
