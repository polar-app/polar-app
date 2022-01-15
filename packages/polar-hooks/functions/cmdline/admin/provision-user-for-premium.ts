import {Accounts} from "polar-payments-stripe/src/Accounts";
import {StripeCustomers} from "polar-payments-stripe/src/StripeCustomers";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {StripeCustomerAccounts} from "polar-payments-stripe/src/StripeCustomerAccounts";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPro = Billing.V2PlanPro;
import V2Plan = Billing.V2Plan;

async function provisionUserForLevel(email: string, plan: V2Plan) {

    const auth = app.auth();
    const user = await auth.getUserByEmail(email);

    if (! user) {
        throw new Error("No user for user: " + email);
    }

    const interval = 'year';

    const account = await StripeCustomerAccounts.get('live', email);
    await StripeCustomers.changePlan('live', email, plan, interval);
    await Accounts.changePlanViaEmail(email, {type: 'stripe', customerID: account.customer.customerID}, plan, interval);

}

const app = FirebaseAdmin.app();

provisionUserForLevel('abovethebarpolar@gmail.com', V2PlanPro)
    .catch(err => console.error(err));
