import {StripeMode} from "./StripeUtils";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import { Plans } from "polar-accounts/src/Plans";

export namespace StripeChangePlans {

    interface IChangePlansOpts {
        readonly stripeMode: StripeMode;
        readonly uid: string;
        readonly email: string;
        readonly plan: Billing.PlanLike;
        readonly interval: Billing.Interval;
    }

    export async function changePlans(opts: IChangePlansOpts) {

        const plan = Plans.toV2(opts.plan);
        const account = await StripeCustomerAccounts.get(opts.stripeMode, opts.email);

        await Accounts.validate(opts.email, opts.uid);
        await StripeCustomers.changePlan(opts.stripeMode, opts.email, plan, opts.interval);
        await Accounts.changePlanViaEmail(opts.email, account.customer.customerID, plan, opts.interval);

    }

}