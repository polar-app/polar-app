import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Billing} from 'polar-accounts/src/Billing';
import {StripeUtils, StripeMode} from "./StripeUtils";
import {StripePlanIDs} from "./StripePlanIDs";
import {Preconditions} from "polar-shared/src/Preconditions";
import {StripeCustomers} from "./StripeCustomers";

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

            // if we already have a customer ID for this email otherwise a NEW customer will be created

            interface CustomerParamsWithEmail {
                readonly customer_email: string;
            }

            interface CustomerParamsWithCustomer {
                readonly customer: string;
            }

            type CustomerParams = CustomerParamsWithEmail | CustomerParamsWithCustomer;

            async function computeCustomerParams(): Promise<CustomerParams> {

                // we can only specify either customer or customer email but not both...
                const existingCustomer = await StripeCustomers.getCustomerByEmail(mode, email);

                if (existingCustomer) {
                    return {
                        customer: existingCustomer.id
                    };
                }

                return {
                    customer_email: email
                };

            }

            const customerParams = await computeCustomerParams();

            // TODO in stripe 8.109.0 we have to use 'any' here because
            // the typescript codes don't work.
            const session = await stripe.checkout.sessions.create(<any> {
                payment_method_types: ['card'],
                ...customerParams,
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
                },

                // 'You can not pass `payment_intent_data` in `subscription` mode.',
                // payment_intent_data: {
                //     // used so that this payment is captured with the account so it can be used with future
                //     // payments.
                //     setup_future_usage: 'off_session',
                // }
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

