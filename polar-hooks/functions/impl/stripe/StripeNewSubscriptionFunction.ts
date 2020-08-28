import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import {StripeUtils} from "./StripeUtils";
import {Arrays} from "polar-shared/src/util/Arrays";

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const plan = req.get('plan');
    const email = req.get('email');

    const stripe = StripeUtils.getStripe();

    // FIXME: I think I need to list subscriptions, then match the given plan,
    // then I need to use the price_id.


    // https://stripe.com/docs/payments/checkout/accept-a-payment
    // https://stripe.com/docs/payments/checkout/set-up-a-subscription#coupons
    // https://stripe.com/docs/payments/checkout/set-up-a-subscription
    // https://github.com/stripe-samples/checkout-single-subscription
    const handleRequest = async () => {

        // TODO: we should catch this in Firestore
        const stripePlans = await stripe.plans.list();
        //
        // const stripePlan = Arrays.first(stripePlans.data.filter(stripePlan => stripePlan.id === plan))
        // stripePlan
        //
        // const session = await stripe.checkout.sessions.create({
        //      payment_method_types: ["card"],
        //      // allow_promotion_codes: true,
        //      customer_email: email,
        //      line_items: [
        //          {
        //              plan: `plan_${plan}`,
        //              quantity: 1
        //          },
        //      ],
        //      mode: "subscription",
        //      success_url: 'https://getpolarized.io/purchase-success.html',
        //      cancel_url: 'https://getpolarized.io/purchase-cancelled.html',
        //   });
        //
        //   res.json({ id: session.id });

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
