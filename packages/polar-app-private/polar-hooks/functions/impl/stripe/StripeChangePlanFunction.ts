import {Billing} from 'polar-accounts/src/Billing';
import { StripeMode } from './StripeUtils';
import {StripeChangePlans} from "./StripeChangePlans";
import {ExpressFunctions} from "../util/ExpressFunctions";

// FIXME: this isn't validating idUser
export const StripeChangePlanFunction = ExpressFunctions.createHookAsync('StripeChangePlanFunction', async (req, res) => {

    console.log(JSON.stringify(req.body, null, '  '));

    console.log("Running v1 of StripeChangePlanFunction.");

    const body: StripeChangePlanBody = req.body;

    await StripeChangePlans.changePlans({...body, stripeMode: body.mode});

    res.sendStatus(200);

});

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.PlanLike;
    readonly interval: Billing.Interval;
    readonly mode: StripeMode;
}

