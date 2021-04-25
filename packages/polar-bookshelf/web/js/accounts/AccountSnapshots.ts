import {Account} from "./Account";
import {UserIDStr} from "../firebase/Firebase";
import {
    OnErrorCallback,
    SnapshotUnsubscriber
} from "polar-shared/src/util/Snapshots";
import {createCachedFirestoreSnapshotSubscriber, OnNextCachedSnapshot, CachedSnapshotSubscriber} from "../snapshots/CachedFirestoreSnapshotSubscriber";
import { IFirestore } from "polar-snapshot-cache/src/store/IFirestore";

const COLLECTION_NAME = "account";

export namespace AccountSnapshots {

    export function create(firestore: IFirestore, uid: string): CachedSnapshotSubscriber<Account> {

        function createRef(uid: UserIDStr) {

            return firestore
                .collection(COLLECTION_NAME)
                .doc(uid);

        }

        function onSnapshot(onNext: OnNextCachedSnapshot<Account>,
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

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);
