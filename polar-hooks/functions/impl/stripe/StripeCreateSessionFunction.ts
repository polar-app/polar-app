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

    const stripe = StripeUtils.getStripe(mode);

    const plan = <Billing.V2PlanLevel> req.query.plan;
    const interval = <Billing.Interval> req.query.interval;
    const email = <string> req.query.email;

    Preconditions.assertPresent(plan, 'plan');
    Preconditions.assertPresent(interval, 'interval');
    Preconditions.assertPresent(email, 'email');

    const planID = StripePlanIDs.fromSubscription(plan, interval);

    async function doAsync() {

        const session = await stripe.checkout.sessions.create({
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
        });

        res.json({ id: session.id });

    }

    doAsync().catch(err => console.log(err));

});

export const StripeCreateSessionFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.Plan;
    readonly interval: Billing.Interval;
}

