import {EmailStr} from "polar-shared/src/util/Strings";
import {Accounts, CustomerAccount} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";

export class StripeCustomerAccounts {

    public static async get(email: EmailStr): Promise<CustomerAccount> {

        const account = await Accounts.get(email);

        if (! account) {
            throw new Error('No account for email: ' + email);
        }

        if (account?.customer) {
            return {
                ...account,
                customer: account.customer
            };
        }

        const customer = await StripeCustomers.getCustomerByEmail(email);

        if (! customer) {
            throw new Error("No customer in stripe via email and no customer on account: " + email);
        }

        return {
            ...account,
            customer: {
                type: 'stripe',
                customerID: customer.id
            }
        };

    }

}
