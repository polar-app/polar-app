import { StripeMode } from './StripeUtils';
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeCreateCustomerPortalFunction = ExpressFunctions.createHook((req, res, next) => {

    async function doAsync() {

        const body: StripeCreateCustomerPortalBody = req.body;

        const session = await StripeCreateCustomerPortalSessions.create({
            stripeMode: body.mode,
            email: body.email
        })

        res.redirect(session.url);

    }

    doAsync().catch(err => next(err));

});

export interface StripeCreateCustomerPortalBody {
    readonly mode: StripeMode;
    readonly email: string;
}

