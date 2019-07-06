/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {Firebase} from '../firebase/Firebase';
import {Firestore} from '../firebase/Firestore';
import {Dialogs} from '../ui/dialogs/Dialogs';
import {Account} from './Account';

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

    /**
     * Callback for when we have new data for the account.
     */
    public static async onSnapshot(handler: (account: Account) => void) {

        // TODO: migrate this to the new Collections code but it's not merged
        // yet.

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

        return ref.onSnapshot(snapshot => {

            if (! snapshot.exists) {
                return;
            }

            const account = <Account> snapshot.data();
            handler(account);

        });

    }

    public static async listenForPlanUpgrades() {

        const user = await Firebase.currentUser();

        if (! user) {
            return;
        }

        const firestore = await Firestore.getInstance();

        const id = user.uid;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const onConfirm = () => {

            const url = new URL(document.location.href);
            url.hash = "#";

            const newLocation = url.toString();

            if (document.location.href === newLocation) {
                document.location.reload();
            } else {
                document.location.href = newLocation;
            }

        };

        let account: Account | undefined;

        ref.onSnapshot(doc => {

            const newAccount = <Account> doc.data();

            try {

                if (account && account.plan !== newAccount.plan) {

                    Dialogs.confirm({
                        title: "Your plan has changed and we need to reload.",
                        subtitle: "This will just take a moment we promise.",
                        onConfirm,
                        noCancel: true
                    });

                }

            } finally {
                account = newAccount;
            }

        });

    }

}

