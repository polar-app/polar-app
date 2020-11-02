import {StripeCustomers} from "./StripeCustomers";
import {StripeMode, StripeUtils} from "./StripeUtils";

export namespace StripeCreateCustomerPortalSessions {

    interface ICreateOpts {
        readonly stripeMode: StripeMode;
        readonly email: string;
    }

    export async function create(opts: ICreateOpts) {

        const {stripeMode, email} = opts;
        const customer = await StripeCustomers.getCustomerByEmail(stripeMode, email);

        if (! customer) {
            throw new Error("No customer for email: " + email);
        }

        const stripe = StripeUtils.getStripe(stripeMode);
        return await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: 'https://app.getpolarized.io'
        });

    }

}