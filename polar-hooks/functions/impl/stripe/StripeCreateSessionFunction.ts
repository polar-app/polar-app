import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Billing} from 'polar-accounts/src/Billing';
import {StripeUtils, StripeMode} from "./StripeUtils";
import {StripePlanIDs} from "./StripePlanIDs";
import {Preconditions} from "polar-shared/src/Preconditions";

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    const mode = <StripeMode> req.query.mode;

    Preconditions.assertPresent(mode, 'mode');

    const stripe = StripeUtils.getStripe(mode);

    const plan = <Billing.V2PlanLevel> req.query.plan;
    const interval = <Billing.Interval> req.query.interval;
    const email = <string> req.query.email;

    Preconditions.assertPresent(plan, 'plan');
    Preconditions.assertPresent(interval, 'interval');
    Preconditions.assertPresent(email, 'email');

    const planID = StripePlanIDs.fromSubscription(mode, plan, interval);

    async function doAsync() {

        try {

            console.log("Creating stripe checkout session for: " + email);
            const session = await stripe.checkout.sessions.create(<any> {
                payment_method_types: ['card'],
                customer_email: email,
                line_items: [
                    {
                        price: planID,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
                billing_address_collection: 'required',
                mode: 'subscription',
                success_url: 'https://app.getpolarized.io/success',
                cancel_url: 'https://app.getpolarized.io/cancel',
                subscription_data: {
                    trial_from_plan: true,
                    payment_behavior: 'allow_incomplete'
                }
            });

            res.json({id: session.id});

        } catch (err) {
            console.error(`Could not properly handle webhook: `, err);
            res.sendStatus(500);
        }

    }

    doAsync()
        .catch(err => console.log(err));

});

export const StripeCreateSessionFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.Plan;
    readonly interval: Billing.Interval;
}

