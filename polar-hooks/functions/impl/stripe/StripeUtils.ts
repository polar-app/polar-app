import Stripe from 'stripe';

const testMode = false;

function getStripeKey() {

    if (process.env.STRIPE_KEY) {
        return process.env.STRIPE_KEY;
    }

    if (testMode || process.env.STRIPE_TEST === 'true') {
        console.log("Using STRIPE_TEST credentials");
        return "sk_test_4qvDsYhxF53NhLCzcGtwaJA100PQdzhkoG";
    }

    console.log("Using production stripe credentials");

    return 'sk_live_6N0oXmsdPxKS6gbUhwHFLncD00Gv3ztN4A';

}

let stripe: Stripe | undefined;

export class StripeUtils {

    public static getStripe() {

        if (stripe) {
            return stripe;
        }

        const config: Stripe.StripeConfig = {
            apiVersion: '2020-08-27',
            typescript: true
        }

        stripe = new Stripe(getStripeKey(), config);
        return stripe;

    }

}
