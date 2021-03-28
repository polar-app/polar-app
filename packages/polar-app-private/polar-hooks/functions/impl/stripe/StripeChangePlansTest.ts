import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "../util/Lazy";
import {StripeChangePlans} from "./StripeChangePlans";
import { Billing } from "polar-accounts/src/Billing";
import {StripeCustomers} from "./StripeCustomers";
import {StripeUtils} from "./StripeUtils";
import { Stripe } from "stripe";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

describe('StripeChangePlans', function() {

    this.timeout(30000);
    it("basic", async function() {

        const email = 'burton@inputneuron.io';

        const firebase = firebaseProvider();
        const auth = firebase.auth();
        const user = await auth.getUserByEmail(email);

        const customer = await StripeCustomers.getCustomerByEmail('test', email);

        if (! customer) {
            throw new Error("No customer for: " + email);
        }

        const stripe = StripeUtils.getStripe('test');

        const createPaymentMethodParams: Stripe.PaymentMethodCreateParams = {
            card: {
                number: "4242424242424242",
                cvc: "123",
                exp_month: 10,
                exp_year: 2021
            },
            type: 'card'

        };

        const paymentMethod = await stripe.paymentMethods.create(createPaymentMethodParams);

        await stripe.customers.update(customer.id, {
            default_source: paymentMethod.id
        })

        async function doTest(plan: Billing.PlanLike, interval: Billing.Interval) {
            await StripeChangePlans.changePlans({
                stripeMode: 'test',
                uid: user.uid,
                email: user.email!,
                plan,
                interval
            })
        }

        await doTest('free', 'month');

        const plans: ReadonlyArray<Billing.PlanLike> = ['pro', 'plus'];
        const intervals: ReadonlyArray<Billing.Interval> = ['month', 'year'];

        for (const plan of plans) {
            for (const interval of intervals) {
                await doTest(plan, interval)
            }
        }

    });

});