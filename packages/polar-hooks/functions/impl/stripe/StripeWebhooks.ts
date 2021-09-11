import {StripePlanIDs} from "./StripePlanIDs";
import {StripeCustomers} from "./StripeCustomers";
import {Accounts} from "./Accounts";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {Billing } from "polar-accounts/src/Billing";
import { Subscriptions } from "./Subscriptions";
import {AccountNotifications} from "./AccountNotifications";
import {Lazy} from "../util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {SentryReporters} from "../reporters/SentryReporter";
import {AmplitudeBackendAnalytics} from "../amplitude/AmplitudeBackendAnalytics";
import { Plans } from "polar-accounts/src/Plans";

const firebase = Lazy.create(() => FirebaseAdmin.app());
const auth = Lazy.create(() => firebase().auth());

export namespace StripeWebhooks {

    import V2PlanFree = Billing.V2PlanFree;
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
            customerID,
        };

    }

    async function sendNotifications(stripeMode: StripeMode,
                                     customerID: string,
                                     from: Billing.V2Subscription,
                                     to: Billing.V2Subscription) {

        async function doSendNotifications() {

            const customer = await StripeCustomers.getCustomerByEmail(stripeMode, {id: customerID});

            if (! customer) {
                throw new Error("No customer for id: " + customerID);
            }

            if (! customer.email) {
                throw new Error("Customer has no email: " + customerID);
            }

            const user = await auth().getUserByEmail(customer.email)

            await AccountNotifications.changePlan(from, to, user);

        }

        try {

            await doSendNotifications();

        } catch (e) {
            const msg = "Could not send notifications: ";
            console.error(msg, e);

            // this is a hack until we have a new/unified logger
            SentryReporters.reportError(msg, e);
        }

    }

    async function computeFromPlanForCustomer(stripeMode: StripeMode,
                                              customerID: string): Promise<Billing.V2Subscription> {

        const defaultSubscription: Billing.V2Subscription = {
            plan: Plans.toV2('free'),
            interval: 'month'
        };

        const customer = await StripeCustomers.getCustomerByEmail(stripeMode, {id: customerID});

        if (! customer) {
            return defaultSubscription;
        }

        if (! customer.email) {
            return defaultSubscription;
        }

        return await Subscriptions.getSubscriptionByEmail(customer.email);

    }

    async function sendAnalytics(stripeMode: StripeMode,
                                 customerID: string,
                                 from: Billing.V2Subscription,
                                 to: Billing.V2Subscription) {

        async function doSendAnalytics() {

            const customer = await StripeCustomers.getCustomerByEmail(stripeMode, {id: customerID});

            if (! customer) {
                throw new Error("No customer for id: " + customerID);
            }

            if (! customer.email) {
                throw new Error("Customer has no email: " + customerID);
            }

            const user = await auth().getUserByEmail(customer.email)

            AmplitudeBackendAnalytics.event2('planChanged', {
                from_plan_level: from.plan.level,
                from_plan_interval: from.interval,
                to_plan_level: to.plan.level,
                to_plan_interval: to.interval
            }, user);

        }

        try {

            await doSendAnalytics();

        } catch (e) {
            const msg = "Could not send notifications: ";
            console.error(msg, e);

            // this is a hack until we have a new/unified logger
            SentryReporters.reportError(msg, e);
        }

    }

    async function doChangePlan(stripeMode: StripeMode,
                                to: Billing.V2Subscription,
                                customerID: string,
                                subscriptionID: string | undefined) {

        const from = await computeFromPlanForCustomer(stripeMode, customerID);

        // must be sent first because as a side effect we read the users current plan

        await StripeCustomers.deleteCustomerSubscriptions(stripeMode,
                                                          {id: customerID},
                                                          subscriptionID ? {except: subscriptionID} : undefined);

        await Accounts.changePlan(stripeMode, customerID, to);

        await sendNotifications(stripeMode, customerID, from, to);
        await sendAnalytics(stripeMode, customerID, from, to);

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
                        await doChangePlan(stripeMode, {plan: sub.plan, interval: sub.interval}, customerID, subscriptionID);
                        break;
                    case 'customer.subscription.updated':
                        await doChangePlan(stripeMode, {plan: sub.plan, interval: sub.interval}, customerID, subscriptionID);
                        break;
                    case 'customer.subscription.deleted':
                        await doChangePlan(stripeMode, {plan: V2PlanFree, interval: 'month'}, customerID, subscriptionID);
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

            const priceID = (checkoutSession.metadata || {}).price_id

            const sub = StripePlanIDs.toSubscription(stripeMode, priceID);

            const {customerID} = checkoutSessionCompletedEvent;

            if (sub.interval === '4year') {
                // we're only handling 4 year here right now and we
                // should use the regular functions for other plans
                // because they're not subscriptions.
                await doChangePlan(stripeMode, {plan: sub.plan, interval: sub.interval}, customerID, undefined);
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
