import {UserIDStr} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {OnErrorCallback, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {
    CachedSnapshotSubscriber,
    createCachedFirestoreSnapshotSubscriber,
    OnNextCachedSnapshot
} from "../snapshots/CachedFirestoreSnapshotSubscriber";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {IAccount} from "polar-firebase/src/firebase/om/AccountCollection";

const COLLECTION_NAME = "account";

export namespace AccountSnapshots {

    export function create(firestore: IFirestoreClient, uid: string): CachedSnapshotSubscriber<IAccount> {

        function createRef(uid: UserIDStr) {

            return firestore
                .collection(COLLECTION_NAME)
                .doc(uid);

        }

        function onSnapshot(onNext: OnNextCachedSnapshot<IAccount>,
                            onError: OnErrorCallback = ERR_HANDLER): SnapshotUnsubscriber {

            const ref = createRef(uid);

            // return ref.onSnapshot(snapshot => {
            //
            //     if (! snapshot.exists) {
            //         onNext(undefined);
            //         return;
            //     }
            //
            //     const account = <Account> snapshot.data();
            //     onNext(account);
            //
            // }, onError);

            return createCachedFirestoreSnapshotSubscriber({
                id: 'accounts',
                ref,
                onNext,
                onError
            })

        }


        return onSnapshot;

    }

}

const ERR_HANDLER = (err: ErrorType) => console.error("Could not create snapshot for account: ", err);
