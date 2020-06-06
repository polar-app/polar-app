import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {StripePlanID, StripePlanIDs} from "./StripePlanIDs";
import {Accounts} from "./Accounts";

// TODO:
//
// - implement signing for webhooks: https://stripe.com/docs/webhooks/signatures

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const handleRequest = async () => {

        console.log(JSON.stringify(req.body, null,  '  '));

        const stripeEvent: StripeEvent = req.body;

        const customerID = stripeEvent.data.object.customer;

        const planID = <StripePlanID> stripeEvent.data.object.plan.id;

        const sub = StripePlanIDs.toAccountPlan(planID);

        switch (stripeEvent.type) {

            case 'customer.subscription.created':
                await Accounts.changePlan(customerID, sub.plan, sub.interval);
                break;
            case 'customer.subscription.updated':
                await Accounts.changePlan(customerID, sub.plan, sub.interval);
                break;
            case 'customer.subscription.deleted':
                await Accounts.changePlan(customerID, 'free', 'month');
                break;

        }

    };

    handleRequest()
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            const now = Date.now();
            console.error(`Could properly handle webhook: ${now}`, err);
            console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
            res.sendStatus(500);
        });

});

export const StripeWebhookFunction = functions.https.onRequest(app);


export interface StripeEvent {

    readonly type: "customer.subscription.created" | "customer.subscription.deleted" | "customer.subscription.updated";

    readonly data: StripeEventData;

}

export interface StripeEventData {
    readonly object: StripeEventSubscriptionObject;
}

export interface StripeEventSubscriptionObject {
    readonly plan: StripeEventPlan;
    readonly customer: string;
}

export interface StripeEventPlan {
    readonly id: string;
    readonly product: string;
}


