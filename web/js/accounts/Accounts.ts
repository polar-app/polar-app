/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {Firebase} from '../firebase/Firebase';
import {Firestore} from '../firebase/Firestore';
import {Dialogs} from '../ui/dialogs/Dialogs';
import {Account} from './Account';
import {Logger} from "polar-shared/src/logger/Logger";
import {DocumentReferences} from "../firebase/firestore/DocumentReferences";

const log = Logger.create();

const COLLECTION_NAME = "account";

export class Accounts {

    public static async ref() {

        const user = await Firebase.currentUser();

        if (! user) {
            // the user is not logged in so we do not have an account that they
            // can use.
            return undefined;
        }

        const firestore = await Firestore.getInstance();

        const id = user.uid;

        return firestore
            .collection(COLLECTION_NAME)
            .doc(id);

    }

    public static async get(): Promise<Account | undefined> {

        const ref = await this.ref();

        if (! ref) {
            return undefined;
        }

        const snapshot = await DocumentReferences.get(ref, {source: 'server-then-cache'});

        if (! snapshot.exists) {
            return undefined;
        }

        return <Account> snapshot.data();

    }

    /**
     * Callback for when we have new data for the account.
     */
    public static async onSnapshot(handler: (account: Account) => void) {

        const ref = await this.ref();

        if (! ref) {
            return undefined;
        }

        return ref.onSnapshot(snapshot => {

            if (! snapshot.exists) {
                return;
            }

            const account = <Account> snapshot.data();
            handler(account);

        }, ERR_HANDLER);

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

        // TODO: move this to the collections class for dealing with snapshots.

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

        }, ERR_HANDLER);

    }

}

const ERR_HANDLER = (err: Error) => log.error("Could not create snapshot for account: ", err);
