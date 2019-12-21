import {accounts} from "polar-accounts/src/accounts";
import {StripeUtils} from "./StripeUtils";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {FirebaseAdmin} from "../util/FirebaseAdmin";
import { Logger } from "polar-shared/src/logger/Logger";

const firebase = FirebaseAdmin.app();
const firestore = firebase.firestore();
const auth = firebase.auth();

const log = Logger.create();

export interface AccountInit {

    readonly plan: accounts.Plan;

    /**
     * The interval for the account. When undefined it's monthly.
     */
    readonly interval?: accounts.Interval;

}

export class Accounts {

    /**
     * Validate that the given HTTP request has the right uid or someone
     * is just trying to monkey with someone's account.
     */
    public static async validate(email: string, uid: string) {

        const user = await auth.getUserByEmail(email);

        if (!user) {
            throw new Error("No user for email: " + email);
        }

        if (user.uid !== uid) {
            throw new Error("Params not validated");
        }

    }

    public static async changePlan(customerID: string,
                                   plan: accounts.Plan,
                                   interval: accounts.Interval) {

        const stripe = StripeUtils.getStripe();

        const customer = await stripe.customers.retrieve(customerID);

        const {email} = customer;

        if (!email) {
            const msg = `No email for customer ID: ${customerID}`;
            log.warn(msg, customer);
            throw new Error(msg);
        }

        await this.changePlanViaEmail(email, plan, interval);

    }


    public static async changePlanViaEmail(email: string | undefined | null,
                                           plan: accounts.Plan,
                                           interval: accounts.Interval) {

        if (!email) {
            throw new Error("Customer has no email address");
        }

        const user = await auth.getUserByEmail(email);

        const lastModified = new Date().toISOString();

        const account: Account = {
            id: user.uid,
            uid: user.uid,
            plan,
            email,
            lastModified,
            interval
        };

        await Accounts.write(account);

    }

    public static async get(email: string): Promise<Account | undefined> {

        const query = firestore
            .collection('account')
            .where('email', '==', email)
            .limit(1);

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return undefined;
        }

        const doc = querySnapshot.docs[0].data();

        return <Account> doc;

    }


    public static async write(account: Account) {

        const ref = firestore
            .collection('account')
            .doc(account.id);

        await ref.set(account);

    }


}

export interface Account extends AccountInit {

    readonly id: string;

    /**
     * The users uid in Firebase.
     */
    readonly uid: string;

    /**
     * The accounts primary email address.  We might add more in the future.
     */
    readonly email: string;

    /**
     * The last time any important action was changed on the account. Payment
     * updated, etc.
     */
    readonly lastModified: ISODateTimeString;

}
