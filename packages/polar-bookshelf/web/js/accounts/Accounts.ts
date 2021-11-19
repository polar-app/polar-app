import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Logger} from "polar-shared/src/logger/Logger";
import {DocumentReferences} from "../firebase/firestore/DocumentReferences";
import {OnErrorCallback, OnNextCallback} from "polar-shared/src/util/Snapshots";
import {IAccount} from "polar-firebase/src/firebase/om/AccountCollection";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {ErrorType} from "../ui/data_loader/UseSnapshotSubscriber";

const log = Logger.create();

const COLLECTION_NAME = "account";

/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
export namespace Accounts {

    export async function createRef() {

        const user = await FirebaseBrowser.currentUserAsync();

        if (! user) {
            // the user is not logged in so we do not have an account that they
            // can use.
            return undefined;
        }

        const firestore = await FirestoreBrowserClient.getInstance();

        const id = user.uid;

        return firestore
            .collection(COLLECTION_NAME)
            .doc(id);

    }

    /**
     * @Deprecated use a snapshot / hook version of this
     */
    export async function get(): Promise<IAccount | undefined> {

        const ref = await createRef();

        if (! ref) {
            return undefined;
        }

        const snapshot = await DocumentReferences.get(ref, {source: 'server-then-cache'});

        if (! snapshot.exists) {
            return undefined;
        }

        return <IAccount> snapshot.data();

    }

    /**
     * Callback for when we have new data for the account.
     */
    export async function onSnapshot(onNext: OnNextCallback<IAccount>,
                                     onError: OnErrorCallback = ERR_HANDLER) {

        const ref = await createRef();

        if (! ref) {
            onNext(undefined);
            return;
        }

        // TODO: use firestore cached snapshots here...
        return ref.onSnapshot(snapshot => {

            if (! snapshot.exists) {
                return;
            }

            const account = <IAccount> snapshot.data();
            onNext(account);

        }, onError);

    }

    export async function listenForPlanUpgrades() {

        const user = await FirebaseBrowser.currentUserAsync();

        if (! user) {
            return;
        }

        const firestore = await FirestoreBrowserClient.getInstance();

        const id = user.uid;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        let account: IAccount | undefined;

        // TODO: move this to the collections class for dealing with snapshots.

        ref.onSnapshot(doc => {

            const newAccount = <IAccount> doc.data();

            try {

                if (account && account.plan !== newAccount.plan) {

                    // FIXME: this needs to be made into a better component..
                    // Dialogs.confirm({
                    //     title: "Your plan has changed and we need to reload.",
                    //     subtitle: "This will just take a moment we promise.",
                    //     type: 'warning',
                    //     onConfirm,
                    //     noCancel: true
                    // });

                }

            } finally {
                account = newAccount;
            }

        }, ERR_HANDLER);

    }

}

const ERR_HANDLER = (err: ErrorType) => console.error("Could not create snapshot for account: ", err);
