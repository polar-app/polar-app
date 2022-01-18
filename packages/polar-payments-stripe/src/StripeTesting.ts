import {StripeCustomers} from "./StripeCustomers";
import {StripeUtils} from "./StripeUtils";
import Stripe from "stripe";

export namespace StripeTesting {

    export const EMAIL = 'burtonator2011@gmail.com'

    export async function purgeCustomer() {
        const customer = await StripeCustomers.getCustomerByEmail('test', EMAIL);
        if (customer) {
            const stripe = StripeUtils.getStripe('test');
            await stripe.customers.del(customer.id);
        }
    }

    export async function createCustomer() {
        const stripe = StripeUtils.getStripe('test');
        return await stripe.customers.create({email: EMAIL});
    }

    export async function createSubscription(customer: Stripe.Customer,
                                             priceID: string) {

        const stripe = StripeUtils.getStripe('test');

        return await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: priceID
                }
            ],
            collection_method: 'send_invoice',
            days_until_due: 30
        })

    }

}