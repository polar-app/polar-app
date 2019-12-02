import {DictionaryPrefs, PersistentPrefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserPref, UserPrefCallback, UserPrefs} from "./UserPrefs";
import firebase from "../../firebase/lib/firebase";
import {Firestore} from "../../firebase/Firestore";
import {Firebase, SnapshotUnsubscriber} from "../../firebase/Firebase";

export class FirestorePrefs extends DictionaryPrefs implements PersistentPrefs {

    private firestore: firebase.firestore.Firestore | undefined;
    private user: firebase.User | undefined;

    constructor(delegate: StringToPrefDict = {}) {
        super(delegate);
    }

    public async init() {
        // TODO: this adds some initial latency ... we could use cache first, then server.
        const userPref = await UserPrefs.get();
        this.update(userPref.toPrefDict());

        this.firestore = await Firestore.getInstance();
        this.user = (await Firebase.currentUser())!;

        // TODO: add a listener by default to keep our copy updated?

    }

    public onSnapshot(onNext: UserPrefCallback, onError?: ErrorCallback): SnapshotUnsubscriber {
        return UserPrefs.onSnapshot(this.firestore!, this.user!.uid, onNext, onError);
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

    public static toPersistentPrefs(userPref: UserPref | undefined) {

        if (! userPref) {
            return undefined;
        }

        const dictionaryPrefs = new DictionaryPrefs(userPref.value)
        return new FirestorePrefs(dictionaryPrefs.toPrefDict());

    }

}
