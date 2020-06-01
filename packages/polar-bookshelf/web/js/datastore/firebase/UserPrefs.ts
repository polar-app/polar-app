import {DictionaryPrefs, PersistentPrefs, Prefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {Collections, UserIDStr} from "../sharing/db/Collections";
import {ErrorHandlerCallback, Firebase} from "../../firebase/Firebase";
import {Preconditions} from "polar-shared/src/Preconditions";
import firebase from "../../firebase/lib/firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {SnapshotUnsubscriber} from "../../firebase/SnapshotSubscribers";

export type UserPrefCallback = (data: UserPref | undefined) => void;

export class UserPrefs {

    private static COLLECTION = 'user_pref';

    private static async getUserID(): Promise<UserIDStr> {
        const user = Preconditions.assertPresent(await Firebase.currentUser());
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
                             onError?: ErrorHandlerCallback): SnapshotUnsubscriber {

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
