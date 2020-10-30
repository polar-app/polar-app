import {StripePlanIDs} from "./StripePlanIDs";
import {StripeCustomers} from "./StripeCustomers";
import {Accounts} from "./Accounts";
import {StripeMode} from "./StripeUtils";
import {Billing } from "polar-accounts/src/Billing";

export namespace StripeWebhooks {

    export type EventType = 'customer.subscription.created' |
                            'customer.subscription.updated' |
                            'customer.subscription.deleted' |
                            'checkout.session.completed';

    interface IHandleEventOpts {
        readonly stripeMode: StripeMode;
        readonly eventType: EventType;
        readonly customerID: string;
        readonly planID: string;
        readonly status: 'active' | string;
        readonly subscriptionID: string;
    }

    export async function handleEvent(opts: IHandleEventOpts) {

        const {stripeMode, customerID, planID, status, subscriptionID} = opts;

        const sub = StripePlanIDs.toSubscription(stripeMode, planID);

        if (status === 'active') {

            async function doChangePlan(plan: Billing.Plan,
                                        interval: Billing.Interval) {

                await StripeCustomers.deleteCustomerSubscriptions(stripeMode, {id: customerID}, {except: subscriptionID});

                await Accounts.changePlan(stripeMode, customerID, plan, interval);

            }

            switch (opts.eventType) {

                case 'customer.subscription.created':
                    // we have to set a default payment method so that when they try to change the plan
                    // in the future they have a payment method applied properly.
                    await StripeCustomers.setDefaultPaymentMethod(stripeMode, customerID);
                    await doChangePlan(sub.plan, sub.interval);
                    break;
                case 'customer.subscription.updated':
                    await doChangePlan(sub.plan, sub.interval);
                    break;
                case 'customer.subscription.deleted':
                    await doChangePlan('free', 'month');
                    break;

                case 'checkout.session.completed':

                    if (sub.interval === '4year') {
                        // we're only handling 4 year here right now and we
                        // should use the regular functions for other plans
                        // because they're not subscriptions.
                        await doChangePlan(sub.plan, sub.interval);
                    }

                    break;

                default:
                    console.log("No handler for event type: " + opts.eventType);
                    break;

            }

        } else {
            console.log("Ignoring incomplete subscription");
        }

    }

}