import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import {StripeMode} from "./StripeUtils";
import {ExpressFunctions} from "../util/ExpressFunctions";

export const StripeCancelSubscriptionFunction = ExpressFunctions.createHook((req, res, next) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const handleRequest = async () => {

        console.log(JSON.stringify(req.body, null,  '  '));

        const body: StripeCancelSubscriptionBody = req.body;

        const account = await StripeCustomerAccounts.get(body.mode, body.email);

        await Accounts.validate(body.email, body.uid);
        await StripeCustomers.cancelSubscription(body.mode, body.email);
        await Accounts.changePlanViaEmail(body.email, account.customer.customerID, 'free', 'month');

        res.sendStatus(200);

    };

    handleRequest()
        .catch(err => next(err));

})

export interface StripeCancelSubscriptionBody {
    readonly uid: string;
    readonly email: string;
    readonly mode: StripeMode;
}
