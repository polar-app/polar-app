import {DictionaryPrefs, PersistentPrefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserPrefCallback, UserPrefs} from "./UserPrefs";
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
        const prefs = await UserPrefs.get();
        this.update(prefs.toPrefDict());

        this.firestore = await Firestore.getInstance();
        this.user = (await Firebase.currentUser())!;

    }

    public async onSnapshot(onNext: UserPrefCallback, onError?: ErrorCallback): Promise<SnapshotUnsubscriber> {
        return UserPrefs.onSnapshot(this.firestore!, this.user!.uid, onNext, onError);
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

}
