import * as React from 'react';
import { Billing } from 'polar-accounts/src/Billing';
import {IDStr} from "polar-shared/src/util/Strings";
import { URLs } from 'polar-shared/src/util/URLs';
import { StripeUtils } from '../../stripe/StripeUtils';

async function startStripeSession(newSubscription: Billing.V2Subscription, email: string): Promise<IDStr> {

    const mode = StripeUtils.stripeMode();
    const params = {
        plan: newSubscription.plan.level,
        interval: newSubscription.interval,
        email,
        mode
    }

    const url = URLs.create({
        base: StripeUtils.createURL('/StripeCreateSession'),
        params
    });

    const response = await fetch(url, {mode: "cors"});
    const json = await response.json();

    return json.id;

}

export function useStripeCheckout() {

    return React.useCallback(async (newSubscription: Billing.V2Subscription, email: string) => {

        const stripe = await StripeUtils.createStripe();

        if (! stripe) {
            throw new Error("No stripe");
        }

        const sessionId = await startStripeSession(newSubscription, email);
        stripe.redirectToCheckout({sessionId})
            .catch(err => console.error("Unable to redirect to stripe checkout: ", err));

    }, []);

}
