/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {Firebase} from '../firebase/Firebase';
import {Firestore} from '../firebase/Firestore';
import {Preconditions} from '../Preconditions';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';

const COLLECTION_NAME = "account";

export class Accounts {

    public static async get(): Promise<Account | undefined> {

        const user = await Firebase.currentUser();

        if (! user) {
            // the user is not logged in so we do not have an account that they
            // can use.
            return undefined;
        }

        const firestore = await Firestore.getInstance();

        const id = user.uid;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        // we always have to get the most up to date version from the server
        // otherwise we will have stale data and the user almost always wants
        // fresh data.
        const snapshot = await ref.get({ source: 'server' });

        if (! snapshot.exists) {
            return undefined;
        }

        return <Account> snapshot.data();

    }

    public static async write(init: AccountInit) {

        const firestore = await Firestore.getInstance();
        const user = await Firebase.currentUser();

        Preconditions.assertPresent("user");

        const id = user!.uid;

        const account: Account = {
            id,
            uid: id,
            email: user!.email!,
            lastModified: ISODateTimeStrings.create(),
            ...init
        };

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(account);
    }

}

interface AccountInit {

    readonly level: AccountLevel;

}

interface Account extends AccountInit {

    /**
     *
     */
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
     * The last time we received a payment from this user.
     */
    readonly lastPayment?: ISODateTimeString;

    /**
     * The last time any important action was changed on the account. Payment
     * updated, etc.
     */
    readonly lastModified: ISODateTimeString;

}

export type AccountLevel = 'free' | 'bronze' | 'silver' | 'gold';
