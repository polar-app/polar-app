import { Account } from "./Account";
import * as firebase from "firebase";
import { CachedSnapshotSubscriber } from "../react/CachedFirestoreSnapshotSubscriber";
export declare namespace AccountSnapshots {
    function create(firestore: firebase.firestore.Firestore, uid: string): CachedSnapshotSubscriber<Account>;
}
