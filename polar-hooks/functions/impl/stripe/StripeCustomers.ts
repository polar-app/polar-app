import Stripe from "stripe";
import {StripeUtils} from "./StripeUtils";
import {Billing} from 'polar-accounts/src/Billing';
import {StripePlanIDs} from "./StripePlanIDs";

export interface StripeCustomerSubscription {
    readonly customer: Stripe.Customer;
    readonly subscription?: Stripe.Subscription;
}

export class StripeCustomers {

    public static async getCustomerByEmail(email: string): Promise<Stripe.Customer | undefined> {

        const stripe = StripeUtils.getStripe();

        const opts = {email};

        const customers = await stripe.customers.list(opts);

        if (customers.data.length === 0) {
            return undefined;
        }

        if (customers.data.length > 1) {
            throw new Error("Too many records for customer in stripe: " + email);
        }

        return customers.data[0];

    }

    public static async getCustomerSubscription(email: string): Promise<StripeCustomerSubscription> {

        const customer = await this.getCustomerByEmail(email);

        if (! customer) {
            throw new Error("No customer for email: " + email);
        }

        if (! customer.subscriptions || customer.subscriptions.data.length === 0) {
            // we have a customer just no subscription yet
            return {customer};
        }

        const activeSubscriptions
            = customer.subscriptions.data.filter(current => current.status === 'active');

        if (activeSubscriptions.length !== 1) {
            const msg = "Too many subscriptions: ";
            console.warn("msg", activeSubscriptions);
            throw new Error(msg + email);
        }

        const subscription = activeSubscriptions[0];

        return {customer, subscription};

    }

    public static async changePlan(email: string, plan: Billing.Plan, interval: Billing.Interval) {

        console.log(`Changing plan for ${email} to ${plan}`);

        const customerSubscription = await this.getCustomerSubscription(email);

        const planID = StripePlanIDs.fromSubscription(plan, interval);

        const stripe = StripeUtils.getStripe();

        const {customer, subscription} = customerSubscription;

        if (subscription) {

            console.log(`Updating subscription ${subscription.id} to plan ID ${planID} (${plan})`);

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

            console.log("Creating new subscription");

            await stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    plan: planID
                }]
            });
        }

    }

    public static async cancelSubscription(email: string) {

        const stripe = StripeUtils.getStripe();
        const customerSubscription = await this.getCustomerSubscription(email);
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

    public static async applyCoupon(email: string, coupon: string) {

        const stripe = StripeUtils.getStripe();

        const customerSubscription = await this.getCustomerSubscription(email);
        const {customer, subscription} = customerSubscription;

        if (!subscription) {
            // we are already done. no subscription.
            return;
        }

        await stripe.subscriptions.update(subscription.id, {coupon});

    }

}
