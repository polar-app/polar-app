import {Billing} from 'polar-accounts/src/Billing';
import { StripeMode } from './StripeUtils';
import {StripeChangePlans} from "./StripeChangePlans";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeChangePlanFunction = ExpressFunctions.createHook((req, res, next) => {

    // TODO: I think we need to validate the logged in user here.

    async function doAsync() {

        console.log(JSON.stringify(req.body, null, '  '));

        const body: StripeChangePlanBody = req.body;

        await StripeChangePlans.changePlans({...body, stripeMode: body.mode});

        res.sendStatus(200);

    }

    doAsync()
        .catch(err => next(err));

});

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.PlanLike;
    readonly interval: Billing.Interval;
    readonly mode: StripeMode;
}

