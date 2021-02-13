import {StripeMode} from "./StripeUtils";
import {IDStr} from "polar-shared/src/util/Strings";
import {StripeWebhooks} from "./StripeWebhooks";
import {ExpressFunctions} from "../util/ExpressFunctions";

// TODO:
//
// - implement signing for webhooks: https://stripe.com/docs/webhooks/signatures

function createApp(stripeMode: StripeMode) {

    return ExpressFunctions.createHookAsync('StripeWebhook', async (req, res, next) => {

        const stripeEvent: StripeEvent = req.body;

        const eventType = stripeEvent.type;

        await StripeWebhooks.handleEvent({
            stripeMode,
            eventType,
            value: stripeEvent
        });

        res.sendStatus(200);

    });

}

export function createStripeWebhookFunction(mode: StripeMode) {
    return createApp(mode);
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


