import {StripeCustomers} from "./StripeCustomers";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {IDUser} from "../util/IDUsers";

export namespace StripeCreateCustomerPortalSessions {

    interface IStripeCreateCustomerPortalSessionRequest {
        readonly stripeMode: StripeMode;
    }

    export async function create(idUser: IDUser,
                                 request: IStripeCreateCustomerPortalSessionRequest) {

        const {stripeMode} = request;
        const email = idUser.user.email;

        if (! email) {
            throw new Error("No email for user");
        }

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