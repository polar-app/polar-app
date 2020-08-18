import {Account} from "./Account";
import {UserIDStr} from "../firebase/Firebase";
import * as firebase from "firebase";
import {
    OnErrorCallback,
    OnNextCallback,
    SnapshotSubscriber,
    SnapshotUnsubscriber
} from "polar-shared/src/util/Snapshots";

const COLLECTION_NAME = "account";

export namespace AccountSnapshots {

    export function create(firestore: firebase.firestore.Firestore, uid: string): SnapshotSubscriber<Account> {

        function createRef(uid: UserIDStr) {

            return firestore
                .collection(COLLECTION_NAME)
                .doc(uid);

        }

        function onSnapshot(onNext: OnNextCallback<Account>,
                            onError: OnErrorCallback = ERR_HANDLER): SnapshotUnsubscriber {

            const ref = createRef(uid);

            return ref.onSnapshot(snapshot => {

                if (! snapshot.exists) {
                    onNext(undefined);
                    return;
                }

                const account = <Account> snapshot.data();
                onNext(account);

            }, onError);

        }

        return onSnapshot;

    }

}

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);
