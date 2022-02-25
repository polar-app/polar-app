import {Billing} from "polar-accounts/src/Billing";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Logger} from "polar-shared/src/logger/Logger";
import {Customer, IAccount} from "polar-firebase/src/firebase/om/AccountCollection";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Lazy} from "polar-shared/src/util/Lazy";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {UIDStr} from "polar-shared/src/util/Strings";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Arrays} from "polar-shared/src/util/Arrays";

const firebase = Lazy.create(() => FirebaseAdmin.app());
const firestore = Lazy.create(() => FirestoreAdmin.getInstance());
const auth = Lazy.create(() => firebase().auth());

const log = Logger.create();

export interface AccountInit {

    readonly plan: Billing.Plan;

    /**
     * The interval for the account. When undefined it's monthly.
     */
    readonly interval?: Billing.Interval;

}

/**
 * @deprecated use AccountCollection instead
 */
export namespace Accounts {

    export const COLLECTION_NAME = 'account';

    /**
     * Validate that the given HTTP request has the right uid or someone
     * is just trying to monkey with someone's account.
     */
    export async function verifyPermissions(email: string, uid: string) {

        const user = await auth().getUserByEmail(email);

        if (!user) {
            throw new Error("No user for email: " + email);
        }

        if (user.uid !== uid) {
            throw new Error(`User uid=${user.uid} is accessing the wrong user account: ${uid}`);
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
                                             interval: Billing.Interval,
                                             expiresAt?: ISODateTimeString) {

        if (!email) {
            throw new Error("Customer has no email address");
        }

        const user = await auth().getUserByEmail(email);

        const lastModified = new Date().toISOString();

        const existingAccount = await Accounts.getByEmail(email);

        const account: IAccount = {
            ver: existingAccount?.ver || undefined,
            id: user.uid,
            uid: user.uid,
            plan,
            email,
            lastModified,
            interval,
            customer,
        };

        if (expiresAt) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (account as any).expiresAt = expiresAt;
        }

        await Accounts.write(Dictionaries.onlyDefinedProperties(account));

    }

    export async function getByEmail(email: string): Promise<IAccount | undefined> {

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

    export async function getByUID(uid: UIDStr): Promise<IAccount | undefined> {

        return Arrays.first(await Collections.list(firestore(), COLLECTION_NAME, [['uid', '==', uid]]))

    }

    export async function write(account: IAccount) {

        const ref = firestore()
            .collection('account')
            .doc(account.id);

        await ref.set(account);

    }


}

/**
 * An account where the customer is not optional.
 */
export interface CustomerAccount extends IAccount {
    readonly customer: Customer;
}
