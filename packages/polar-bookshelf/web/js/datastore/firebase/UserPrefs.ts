import {
    DictionaryPrefs,
    PersistentPrefs,
    Prefs,
    StringToPrefDict
} from "../../util/prefs/Prefs";
import {Collections, UserIDStr} from "../sharing/db/Collections";
import {Firebase} from "../../firebase/Firebase";
import * as firebase from 'firebase/app';
import {
    OnErrorCallback,
    SnapshotUnsubscriber
} from 'polar-shared/src/util/Snapshots';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export type UserPrefCallback = (data: UserPref | undefined) => void;

export class UserPrefs {

    private static COLLECTION = 'user_pref';

    private static async getUserID(): Promise<UserIDStr> {

        const user = await Firebase.currentUserAsync();

        if (! user) {
            throw new Error("No user");
        }

        return user.uid;

    }

    public static async get(): Promise<Prefs> {

        const uid  = await this.getUserID();
        const userPref: UserPref | undefined = await Collections.getByID(this.COLLECTION, uid);

        if (userPref) {
            return new DictionaryPrefs(userPref.value);
        }

        return new DictionaryPrefs();

    }

    public static onSnapshot(firestore: firebase.firestore.Firestore,
                             uid: UserIDStr,
                             onSnapshot: UserPrefCallback,
                             onError?: OnErrorCallback): SnapshotUnsubscriber {

        const ref = firestore.collection(this.COLLECTION).doc(uid);

        const handleSnapshot = (snapshot: DocumentSnapshot) => {
            const data = <UserPref | undefined> snapshot.data();
            onSnapshot(data);
        };

        return ref.onSnapshot(handleSnapshot, onError);

    }
    public static async set(prefs: PersistentPrefs) {

        const uid  = await this.getUserID();
        const ref = await Collections.createRef(this.COLLECTION, uid);

        const userPref: UserPref = {
            uid,
            value: prefs.toPrefDict()
        };

        await ref.set(userPref);

    }

}

export interface UserPref {
    readonly uid: UserIDStr;
    readonly value: StringToPrefDict;
}
