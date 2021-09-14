import {Customer} from "polar-firebase/src/firebase/om/AccountCollection";
import {Accounts} from "polar-hooks-functions/impl/stripe/Accounts";
import {Billing} from "polar-accounts/src/Billing";

interface ChangePlanConfig {
    // Email of the customer
    email: string,

    // The original transaction ID, which doesn't change across monthly billings for the same plan
    customerId: string,

    // The plan code that was purchased
    productId: "plus" | "pro",

    paymentMethod?: "apple_iap" | "google_iap",

    // Unix timestamp after which the Plan should be no longer considered active
    expiresAt?: number,
}

export default async function changePlanForEmail(changePlanConfig: ChangePlanConfig) {

    const email = changePlanConfig.email;

    const customer: Customer = {
        type: changePlanConfig.paymentMethod ?? 'apple_iap',
        customerID: changePlanConfig.customerId,
    };
    const plan: Billing.Plan = {
        level: changePlanConfig.productId,
        ver: "v2",
    };
    const interval: Billing.Interval = 'month';
    const expiresAt = changePlanConfig.expiresAt
        ? new Date(changePlanConfig.expiresAt * 1000).toISOString()
        : undefined;

    await Accounts.changePlanViaEmail(email, customer, plan, interval, expiresAt);

}
