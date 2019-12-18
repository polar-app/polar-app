import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import {StripeUtils} from './StripeUtils';
import {AccountPlan, PlanInterval} from './StripeWebhookFunction';
import {Accounts} from './StripeWebhookFunction';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import {StripePlanIDs} from "./StripePlanIDs";

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const handleRequest = async () => {

        try {

            console.log(JSON.stringify(req.body, null, '  '));

            const body: StripeChangePlanBody = req.body;

            await Accounts.validate(body.email, body.uid);
            await StripeCustomers.changePlan(body.email, body.plan, body.interval);
            await Accounts.changePlanViaEmail(body.email, body.plan);

            res.sendStatus(200);

        } catch (err) {
            const now = Date.now();
            console.error(`Could properly handle webhook: ${now}`, err);
            console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
            res.sendStatus(500);
        }

    };

    handleRequest()
        .catch(err => console.error("Failed to handle request: ", err));

});

export const StripeChangePlanFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: AccountPlan;
    readonly interval: PlanInterval;
}

interface StripeCustomerSubscription {
    readonly customer: Stripe.customers.ICustomer;
    readonly subscription?: Stripe.subscriptions.ISubscription;
}

export class StripeCustomers {

    public static async getCustomerByEmail(email: string): Promise<Stripe.customers.ICustomer | undefined> {

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

        if  (! customer) {
            throw new Error("No customer for email: " + email);
        }

        if (customer.subscriptions.data.length === 0) {
            // we have a customer just no subscription yet
            return {customer};
        }

        const activeSubscriptions
            = customer.subscriptions.data.filter(current => current.status === 'active');

        if (activeSubscriptions.length !== 1) {
            throw new Error("Too many subscriptions: " + email);
        }

        const subscription = activeSubscriptions[0];

        return {customer, subscription};

    }

    public static async changePlan(email: string, plan: AccountPlan, interval: PlanInterval) {

        console.log(`Changing plan for ${email} to ${plan}`);

        const customerSubscription = await this.getCustomerSubscription(email);

        const planID = StripePlanIDs.fromAccountPlan(plan, interval);

        const stripe = StripeUtils.getStripe();

        const {customer, subscription} = customerSubscription;

        if (subscription) {

            console.log(`Updating subscription ${subscription.id} to plan ID ${planID} (${plan})`);

            await stripe.subscriptions.update(subscription.id, {
                prorate: true,
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
                plan: planID
            });
        }

    }

    public static async cancelSubscription(email: string) {

        const stripe = StripeUtils.getStripe();
        const customerSubscription = await this.getCustomerSubscription(email);
        const {customer, subscription} = customerSubscription;

        if  (! subscription) {
            // we are already done. no subscription.
            return;
        }

        await stripe.subscriptions.del(subscription.id);

        // TODO: right now we MUST delete the customer because when checkout
        // kicks in again we get another customer with the same email.
        await stripe.customers.del(customer.id);

    }

}
