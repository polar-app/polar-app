import {Accounts} from "../../impl/stripe/Accounts";
import {StripeCustomers} from "../../impl/stripe/StripeCustomers";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {StripeCustomerAccounts} from "../../impl/stripe/StripeCustomerAccounts";

type Plan = 'bronze' | 'silver' | 'gold';

async function provisionUserForLevel(email: string, plan: Plan) {

    const auth = app.auth();
    const user = await auth.getUserByEmail(email);

    if (! user) {
        throw new Error("No user for user: " + email);
    }

    const interval = 'year';

    const account = await StripeCustomerAccounts.get(email);
    await StripeCustomers.changePlan(email, plan, interval);
    await Accounts.changePlanViaEmail(email, account.customer.customerID, plan, interval);

}

const app = FirebaseAdmin.app();

provisionUserForLevel('abovethebarpolar@gmail.com', 'gold')
    .catch(err => console.error(err));
