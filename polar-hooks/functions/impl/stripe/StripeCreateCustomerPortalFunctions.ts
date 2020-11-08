import {IDUser} from "../util/IDUsers";
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";
import {
    IStripeCreateCustomerPortalRequest,
    IStripeCreateCustomerPortalResponse
} from "polar-backend-api/src/api/stripe/StripeCreateCustomerPortal";

export namespace StripeCreateCustomerPortalFunctions {

    export async function exec(idUser: IDUser,
                               request: IStripeCreateCustomerPortalRequest): Promise<IStripeCreateCustomerPortalResponse> {

        const session = await StripeCreateCustomerPortalSessions.create(idUser, {
            stripeMode: request.stripeMode,
        });

        return {
            url: session.url
        }
    }

}