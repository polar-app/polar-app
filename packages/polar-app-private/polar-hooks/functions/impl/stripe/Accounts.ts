import {Billing} from "polar-accounts/src/Billing";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Logger} from "polar-shared/src/logger/Logger";
import {IDStr} from "polar-shared/src/util/Strings";
import {Lazy} from "../util/Lazy";
import {IAccount} from "polar-firebase/src/firebase/om/AccountCollection";

const firebase = Lazy.create(() => FirebaseAdmin.app());
const firestore = Lazy.create(() => firebase().firestore());
const auth = Lazy.create(() => firebase().auth());

const log = Logger.create();

export interface AccountInit {

    readonly plan: Billing.Plan;

    /**
     * The interval for the account. When undefined it's monthly.
     */
    readonly interval?: Billing.Interval;

}

export namespace Accounts {

    export type Customer = StripeCustomer;

    /**
     * Validate that the given HTTP request has the right uid or someone
     * is just trying to monkey with someone's account.
     */
    export async function validate(email: string, uid: string) {

        const user = await auth().getUserByEmail(email);

        if (!user) {
            throw new Error("No user for email: " + email);
        }

        if (user.uid !== uid) {
            throw new Error("Params not validated");
        }

    }

    export async function changePlan(mode: StripeMode,
                                     customerID: string,
                                     // from: Billing.V2Subscription,
                                     to: Billing.V2Subscription) {

        const stripe = StripeUtils.getStripe(mode);

        const customer = await stripe.customers.retrieve(customerID);

        if (customer.deleted) {
            throw new Error("Can not change plan on deleted customer");
        }

        const {email} = customer;

        if (!email) {
            const msg = `No email for customer ID: ${customerID}`;
            log.warn(msg, customer);
            throw new Error(msg);
        }

        await changePlanViaEmail(email, {type: 'stripe', customerID}, to.plan, to.interval);

    }

    export async function changePlanViaEmail(email: string | undefined | null,
                                             customer: Customer,
                                             plan: Billing.Plan,
                                             interval: Billing.Interval) {

        if (!email) {
            throw new Error("Customer has no email address");
        }

        const user = await auth().getUserByEmail(email);

        const lastModified = new Date().toISOString();

        const account: IAccount = {
            id: user.uid,
            uid: user.uid,
            plan,
            email,
            lastModified,
            interval,
            customer
        };

        await Accounts.write(account);

    }

    export async function get(email: string): Promise<IAccount | undefined> {

        const query = firestore()
            .collection('account')
            .where('email', '==', email)
            .limit(1);

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return undefined;
        }

        const doc = querySnapshot.docs[0].data();

        return <IAccount> doc;

    }

    export async function write(account: IAccount) {

        const ref = firestore()
            .collection('account')
            .doc(account.id);

        await ref.set(account);

    }


}

export interface StripeCustomer {
    readonly type: 'stripe' | 'apple_iap';
    readonly customerID: IDStr;
}
/**
 * An account where the customer is not optional.
 */
export interface CustomerAccount extends IAccount {
    readonly customer: StripeCustomer;
}
