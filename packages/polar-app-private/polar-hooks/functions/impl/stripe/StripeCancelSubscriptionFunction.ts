import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import {StripeMode} from "./StripeUtils";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeCancelSubscriptionFunction = ExpressFunctions.createHookAsync('StripeCancelSubscriptionFunction', async (req, res, next) => {

    console.log(JSON.stringify(req.body, null,  '  '));

    const body: StripeCancelSubscriptionBody = req.body;

    const account = await StripeCustomerAccounts.get(body.mode, body.email);

    await Accounts.validate(body.email, body.uid);
    await StripeCustomers.cancelSubscription(body.mode, body.email);
    await Accounts.changePlanViaEmail(body.email, account.customer.customerID, 'free', 'month');

    res.sendStatus(200);

})

export interface StripeCancelSubscriptionBody {
    readonly uid: string;
    readonly email: string;
    readonly mode: StripeMode;
}
