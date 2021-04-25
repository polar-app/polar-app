import {loadStripe} from '@stripe/stripe-js';

export namespace StripeUtils {

    export type StripeMode = 'test' | 'live';

    export function createURL(path: string) {

        function createHost() {

            switch (StripeUtils.stripeMode()) {
                case "test":
                    return 'us-central1-polar-cors-beta.cloudfunctions.net'
                case "live":
                    return 'us-central1-polar-32b0f.cloudfunctions.net'
            }

        }

        const host = createHost();

        return `https://${host}${path}`;

    }

    export function stripeMode(): StripeMode {

        const stripeApiKey = getStripeAPIKey();
        return stripeApiKey.startsWith("pk_test_") ? 'test' : 'live';

    }

    export function getStripeAPIKey(): string {
        return localStorage.getItem('stripe_api_key') || 'pk_live_nuUlFGZzCqFCnx19rAfGBO9900Fx3Mpi3m';
    }

    export async function createStripe() {
        const stripeApiKey = getStripeAPIKey();
        return await loadStripe(stripeApiKey);
    }

}
