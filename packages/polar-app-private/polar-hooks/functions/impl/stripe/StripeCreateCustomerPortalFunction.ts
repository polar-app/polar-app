import { StripeMode } from './StripeUtils';
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeCreateCustomerPortalFunction = ExpressFunctions.createHookAsync(async (req, res) => {

    const body: StripeCreateCustomerPortalBody = req.body;

    const session = await StripeCreateCustomerPortalSessions.create({
        stripeMode: body.mode,
        email: body.email
    })

    res.redirect(session.url);

});

export interface StripeCreateCustomerPortalBody {
    readonly mode: StripeMode;
    readonly email: string;
}

