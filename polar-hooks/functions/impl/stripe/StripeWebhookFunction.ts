import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {StripeMode} from "./StripeUtils";
import {IDStr} from "polar-shared/src/util/Strings";
import {StripeWebhooks} from "./StripeWebhooks";

// TODO:
//
// - implement signing for webhooks: https://stripe.com/docs/webhooks/signatures

function createApp(stripeMode: StripeMode) {

    const app = express();

    app.use(bodyParser.json());
    app.use(cors({ origin: true }));

    app.use((req, res) => {

        const handleRequest = async () => {

            try {

                const stripeEvent: StripeEvent = req.body;

                const eventType = stripeEvent.type;
                const customerID = stripeEvent.data.object.customer;
                const planID = stripeEvent.data.object.plan.id;
                const status = stripeEvent.data.object.status;
                const subscriptionID = stripeEvent.data.object.id;

                await StripeWebhooks.handleEvent({
                    stripeMode,
                    eventType,
                    customerID,
                    planID,
                    status,
                    subscriptionID
                });

                res.sendStatus(200);

            } catch (err) {
                const now = Date.now();
                console.error(`Could not properly handle webhook: ${now}`, err);
                console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
                res.sendStatus(500);
            }

        }

        handleRequest()
            .catch(err => console.error(err));

    });

    return app;

}

export function createStripeWebhookFunction(mode: StripeMode) {
    return functions.https.onRequest(createApp(mode))
}

export interface StripeEvent {

    readonly type: "customer.subscription.created" | "customer.subscription.deleted" | "customer.subscription.updated";

    readonly data: StripeEventData;

}

export interface StripeEventData {
    readonly object: StripeEventSubscriptionObject;
}

export interface StripeEventSubscriptionObject {
    readonly id: IDStr;
    readonly plan: StripeEventPlan;
    readonly customer: string;
    readonly status: 'incomplete' | 'active';
}

export interface StripeEventPlan {
    readonly id: string;
    readonly product: string;
}


