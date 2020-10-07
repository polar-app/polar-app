import * as React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { Billing } from 'polar-accounts/src/Billing';
import {IDStr} from "polar-shared/src/util/Strings";

async function startStripeSession(newSubscription: Billing.V2Subscription): Promise<IDStr> {

    const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeCreateSession?plan=${newSubscription.plan.level}&interval=${newSubscription.interval}`;

    const response = await fetch(url);
    const json = await response.json();

    return json.id;

}

async function createStripe() {
    const stripeApiKey = localStorage.getItem('stripe_api_key') || 'pk_live_nuUlFGZzCqFCnx19rAfGBO9900Fx3Mpi3m';
    return await loadStripe(stripeApiKey);
}

export function useStripeCheckout() {

    return React.useCallback(async (newSubscription: Billing.V2Subscription) => {

        const stripe = await createStripe();

        if (! stripe) {
            throw new Error("No stripe");
        }

        const sessionId = await startStripeSession(newSubscription);
        stripe.redirectToCheckout({sessionId})

    }, []);


}