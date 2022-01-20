import {StripeMode} from "./StripeUtils";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {Billing} from "polar-accounts/src/Billing";
import {Plans} from "polar-accounts/src/Plans";

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

        // ** first make sure the user performing this operation has the right permissions
        await Accounts.verifyPermissions(opts.email, opts.uid);

        // ** now change their plan directly on stripe
        await StripeCustomers.changePlan(opts.stripeMode, opts.email, plan, opts.interval);

        // ** now that the stripe configuration is setup, change their plan in the DB to reflect what they've paid for
        await Accounts.changePlanViaEmail(opts.email, {type: 'stripe', customerID: account.customer.customerID}, plan, opts.interval);

    }

}
