import {DictionaryPrefs, IPersistentPrefs, Prefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserIDStr} from "polar-shared/src/util/Strings";
import {Collections,} from "polar-firestore-like/src/Collections";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {OnErrorCallback, SnapshotUnsubscriber} from 'polar-shared/src/util/Snapshots';
import {ISnapshot} from "../../snapshots/CachedSnapshotSubscriberContext";
import {createCachedFirestoreSnapshotSubscriber} from "../../snapshots/CachedFirestoreSnapshotSubscriber";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export type UserPrefCallback = (data: IUserPref | undefined) => void;

export namespace UserPrefs {

    const COLLECTION = 'user_pref';

    async function getUserID(): Promise<UserIDStr> {

        const user = await FirebaseBrowser.currentUserAsync();

        if (! user) {
            throw new Error("No user");
        }

        return user.uid;

    }

    export async function get(): Promise<Prefs> {

        const uid  = await getUserID();
        const firestore = await FirestoreBrowserClient.getInstance();

        const userPref: IUserPref | undefined = await Collections.getByID(firestore, COLLECTION, uid);

        if (userPref) {
            return new DictionaryPrefs(userPref.value);
        }

        return new DictionaryPrefs();

    }


    export async function set(prefs: IPersistentPrefs) {

        const uid  = await getUserID();
        const firestore = await FirestoreBrowserClient.getInstance();

        const ref = Collections.createRef(firestore, COLLECTION, uid);

        const userPref: IUserPref = {
            uid,
            value: prefs.toPrefDict()
        };

        await ref.set(userPref);

    }

    export function onSnapshot(firestore: IFirestoreClient,
                               uid: UserIDStr,
                               onSnapshot: UserPrefCallback,
                               onError?: OnErrorCallback): SnapshotUnsubscriber {

        const ref = firestore.collection(COLLECTION).doc(uid);

        const handleSnapshot = (snapshot: ISnapshot<IUserPref> | undefined) => {
            if (snapshot) {
                const data = <IUserPref | undefined> snapshot.value;
                onSnapshot(data);
            }
        };

        return createCachedFirestoreSnapshotSubscriber<IUserPref>({
            id: 'prefs',
            ref,
            onNext: handleSnapshot,
            onError
        });

    }

    export type UserPrefCallback2 = (data: ISnapshot<IUserPref> | undefined) => void;

    export function onSnapshot2(firestore: IFirestoreClient,
                                uid: UserIDStr,
                                onSnapshot: UserPrefCallback2,
                                onError?: OnErrorCallback): SnapshotUnsubscriber {

        const ref = firestore.collection(COLLECTION).doc(uid);

        const handleSnapshot = (snapshot: ISnapshot<IUserPref> | undefined) => {
            if (snapshot) {
                onSnapshot(snapshot);
            }
        };

        return createCachedFirestoreSnapshotSubscriber<IUserPref>({
            id: 'user_prefs',
            ref,
            onNext: handleSnapshot,
            onError
        });

    }

}

export interface IUserPref {
    readonly uid: UserIDStr;
    readonly value: StringToPrefDict;
}
