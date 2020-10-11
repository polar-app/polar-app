import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {StripePlanIDs} from "./StripePlanIDs";

export namespace StripeCreateSessions {

    interface CustomerParamsWithEmail {
        readonly customer_email: string;
    }

    interface CustomerParamsWithCustomer {
        readonly customer: string;
    }

    type CustomerParams = CustomerParamsWithEmail | CustomerParamsWithCustomer;

    interface ICreateOpts {
        readonly stripeMode: StripeMode;
        readonly email: string;
        readonly interval: Billing.Interval;
        readonly plan: Billing.V2PlanLevel;
    }

    interface IStripeSession {
        readonly id: string;
    }

    export async function create(opts: ICreateOpts): Promise<IStripeSession> {

        const {stripeMode, email, interval, plan} = opts;

        const stripe = StripeUtils.getStripe(stripeMode);

        console.log("Creating stripe checkout session for: " + email);

        // if we already have a customer ID for this email otherwise a NEW customer will be created

        const customerParams = await computeCustomerParams(stripeMode, email);

        const mode = 'subscription';

        function computeSubscriptionParams(): any {
            switch (mode) {
                case "subscription":
                    return {
                        subscription_data: {
                            trial_from_plan: true,
                            payment_behavior: 'allow_incomplete'
                        }
                    };
                //
                // case "payment":
                //     return {
                //         subscription_data: {
                //             payment_behavior: 'allow_incomplete'
                //         }
                //     };

            }
        }

        const subscriptionParams = computeSubscriptionParams();

        const planID = StripePlanIDs.fromSubscription(stripeMode, plan, interval);

        // TODO in stripe 8.109.0 we have to use 'any' here because the typescript codes don't work.
        const createOpts: any = {
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
            mode,
            success_url: 'https://app.getpolarized.io/success',
            cancel_url: 'https://app.getpolarized.io/cancel',
            ...subscriptionParams
        }

        console.log("Creating session with: ", createOpts);

        const session = await stripe.checkout.sessions.create(createOpts);

        return {
            id: session.id
        };

    }


    async function computeCustomerParams(stripeMode: StripeMode, email: string): Promise<CustomerParams> {

        // we can only specify either customer or customer email but not both...
        const existingCustomer = await StripeCustomers.getCustomerByEmail(stripeMode, email);

        if (existingCustomer) {
            return {
                customer: existingCustomer.id
            };
        }

        return {
            customer_email: email
        };

    }

}