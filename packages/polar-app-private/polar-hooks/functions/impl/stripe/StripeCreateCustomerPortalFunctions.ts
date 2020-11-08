import {IDUser} from "../util/IDUsers";
import {StripeMode} from "./StripeUtils";
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";
import express from 'express';

export namespace StripeCreateCustomerPortalFunctions {

    interface IStripeCreateCustomerPortalRequest {
        readonly stripeMode: StripeMode;
    }

    export async function exec(idUser: IDUser,
                               request: IStripeCreateCustomerPortalRequest,
                               req: express.Request,
                               res: express.Response) {

        const session = await StripeCreateCustomerPortalSessions.create(idUser, {
            stripeMode: request.stripeMode,
        });

        res.redirect(session.url);

    }

}