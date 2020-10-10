import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {StripePlanIDs, StripePriceID} from "./StripePlanIDs";
import {Accounts} from "./Accounts";
import {StripeMode} from "./StripeUtils";
import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import {IDStr} from "polar-shared/src/util/Strings";

// TODO:
//
// - implement signing for webhooks: https://stripe.com/docs/webhooks/signatures

function createApp(mode: StripeMode) {

    const app = express();

    app.use(bodyParser.json());
    app.use(cors({ origin: true }));

    app.use((req, res) => {

        // req.body should be a JSON body for stripe with the payment metadata.

        const handleRequest = async () => {

            try {

                console.log(JSON.stringify(req.body, null, '  '));

                const stripeEvent: StripeEvent = req.body;

                const customerID = stripeEvent.data.object.customer;

                const stripePriceID = stripeEvent.data.object.plan.id;

                const sub = StripePlanIDs.toSubscription(mode, stripePriceID);

                if (stripeEvent.data.object.status === 'active') {

                    async function doChangePlan(plan: Billing.Plan,
                                                interval: Billing.Interval) {

                        const subscriptionID = stripeEvent.data.object.id;
                        await StripeCustomers.cancelActiveCustomerSubscriptions(mode, {id: customerID}, {except: subscriptionID});

                        await Accounts.changePlan(mode, customerID, plan, interval);

                    }

                    switch (stripeEvent.type) {

                        case 'customer.subscription.created':
                            // we have to set a default payment method so that when they try to change the plan
                            // in the future they have a payment method applied properly.
                            await StripeCustomers.setDefaultPaymentMethod(mode, customerID);
                            await doChangePlan(sub.plan, sub.interval);
                            break;
                        case 'customer.subscription.updated':
                            await doChangePlan(sub.plan, sub.interval);
                            break;
                        case 'customer.subscription.deleted':
                            await doChangePlan('free', 'month');
                            break;

                    }

                } else {
                    console.log("Ignoring incomplete subscription");
                }

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


