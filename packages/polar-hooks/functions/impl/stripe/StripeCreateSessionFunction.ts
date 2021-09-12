import {Billing} from 'polar-accounts/src/Billing';
import {StripeMode} from "./StripeUtils";
import {Preconditions} from "polar-shared/src/Preconditions";
import {StripeCreateSessions} from "./StripeCreateSessions";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeCreateSessionFunction = ExpressFunctions.createHookAsync('StripeCreateSessionFunction', async (req, res) => {

    const stripeMode = <StripeMode> req.query.mode;
    const plan = <Billing.V2PlanLevel> req.query.plan;
    const interval = <Billing.Interval> req.query.interval;
    const email = <string> req.query.email;

    Preconditions.assertPresent(stripeMode, 'mode');
    Preconditions.assertPresent(plan, 'plan');
    Preconditions.assertPresent(interval, 'interval');
    Preconditions.assertPresent(email, 'email');

    const session = await StripeCreateSessions.create({stripeMode, plan, interval, email});

    res.json({id: session.id});

});

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.Plan;
    readonly interval: Billing.Interval;
}

