import {StripePlanIDs} from "./StripePlanIDs";
import {StripeCustomers} from "./StripeCustomers";
import {Accounts} from "./Accounts";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {Billing } from "polar-accounts/src/Billing";

export namespace StripeWebhooks {

    export type EventType = 'customer.subscription.created' |
                            'customer.subscription.updated' |
                            'customer.subscription.deleted' |
                            'checkout.session.completed' |
                            'payment_intent.succeeded';

    interface IStripeEvent {

        readonly stripeMode: StripeMode;
        readonly eventType: EventType;

        /**
         * The raw stripe event we received.
         */
        readonly value: any;
    }

    interface IStripeSubscriptionEvent {
        readonly eventType: EventType;
        readonly customerID: string;
        readonly planID: string;
        readonly status: 'active' | string;
        readonly subscriptionID: string;
    }

    interface IStripeCheckoutSessionCompletedEvent {
        readonly id: string;
        readonly customerID: string;
    }

    function toSubscriptionEvent(rawEvent: any): IStripeSubscriptionEvent {

        const eventType = rawEvent.type;
        const customerID = rawEvent.data.object.customer;
        const planID = rawEvent.data.object.plan.id;
        const status = rawEvent.data.object.status;
        const subscriptionID = rawEvent.data.object.id;

        return {
            eventType,
            customerID,
            planID,
            status,
            subscriptionID
        }

    }

    function toCheckoutSessionCompletedEvent(rawEvent: any): IStripeCheckoutSessionCompletedEvent {

        const id: string = rawEvent.data.object.id;
        const customerID: string = rawEvent.data.object.customer;

        return {
            id,
            customerID
        };

    }

    async function doChangePlan(stripeMode: StripeMode,
                                plan: Billing.Plan,
                                interval: Billing.Interval,
                                customerID: string,
                                subscriptionID: string | undefined) {

        await StripeCustomers.deleteCustomerSubscriptions(stripeMode,
                                                          {id: customerID},
                                                          subscriptionID ? {except: subscriptionID} : undefined);

        await Accounts.changePlan(stripeMode, customerID, plan, interval);

    }

    export async function handleEvent(event: IStripeEvent) {

        const stripeMode = event.stripeMode;

        async function handleSubscriptionEvent() {

            const subscriptionEvent = toSubscriptionEvent(event.value);

            const {status, customerID, planID, subscriptionID} = subscriptionEvent;
            const sub = StripePlanIDs.toSubscription(stripeMode, planID);

            if (status === 'active') {

                switch (event.eventType) {

                    case 'customer.subscription.created':
                        // we have to set a default payment method so that when they try to change the plan
                        // in the future they have a payment method applied properly.
                        await StripeCustomers.setDefaultPaymentMethod(stripeMode, customerID);
                        await doChangePlan(stripeMode, sub.plan, sub.interval, customerID, subscriptionID);
                        break;
                    case 'customer.subscription.updated':
                        await doChangePlan(stripeMode, sub.plan, sub.interval, customerID, subscriptionID);
                        break;
                    case 'customer.subscription.deleted':
                        await doChangePlan(stripeMode, 'free', 'month', customerID, subscriptionID);
                        break;

                }

            } else {
                console.log("Ignoring incomplete subscription");
            }

        }

        async function handleCheckoutSessionCompleted() {

            const checkoutSessionCompletedEvent = toCheckoutSessionCompletedEvent(event.value);

            async function retrieveCheckoutSession() {
                const stripe = StripeUtils.getStripe(stripeMode);
                return await stripe.checkout.sessions.retrieve(checkoutSessionCompletedEvent.id);
            }

            const checkoutSession = await retrieveCheckoutSession();

            if (! checkoutSession.line_items) {
                throw new Error("No line items");
            }

            const priceID = checkoutSession.line_items.data[0].price.id;

            const sub = StripePlanIDs.toSubscription(stripeMode, priceID);

            const {customerID} = checkoutSessionCompletedEvent;

            if (sub.interval === '4year') {
                // we're only handling 4 year here right now and we
                // should use the regular functions for other plans
                // because they're not subscriptions.
                await doChangePlan(stripeMode, sub.plan, sub.interval, customerID, undefined);
            }

        }

        switch (event.eventType) {

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await handleSubscriptionEvent();
                break;

            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted();
                break;

            default:
                console.log("No handler for event type: " + event.eventType);
                break;

        }

    }

}