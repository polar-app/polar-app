import {DictionaryPrefs, PersistentPrefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserPref, UserPrefCallback, UserPrefs} from "./UserPrefs";
import firebase from "../../firebase/lib/firebase";
import {Firestore} from "../../firebase/Firestore";
import {ErrorHandlerCallback, Firebase} from "../../firebase/Firebase";
import {Latch} from "polar-shared/src/util/Latch";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SnapshotUnsubscriber} from "../../firebase/SnapshotSubscribers";

export class FirebaseDatastorePrefs extends DictionaryPrefs implements PersistentPrefs {

    private firestore: firebase.firestore.Firestore | undefined;
    private user: firebase.User | undefined;

    private initLatch = new Latch<boolean>();

    constructor(delegate: StringToPrefDict = {}) {
        super(delegate);
    }

    public async init() {

        const userPref = await UserPrefs.get();
        this.update(userPref.toPrefDict());

        this.firestore = await Firestore.getInstance();
        this.user = (await Firebase.currentUser())!;

        this.initLatch.resolve(true);

    }

    public onSnapshot(onNext: UserPrefCallback, onError: ErrorHandlerCallback = NULL_FUNCTION): SnapshotUnsubscriber {

        const snapshotUnsubscriberLatch = new Latch<SnapshotUnsubscriber>();

        const doHandle = async () => {

            await this.initLatch.get();

            return UserPrefs.onSnapshot(this.firestore!, this.user!.uid, onNext, onError);

        };

        doHandle().catch(err => onError(err));

        const result = () => {
            snapshotUnsubscriberLatch.get()
                .then(unsubscriber => unsubscriber())
                .catch(err => onError(err));

        };

        return result;
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

    public static toPersistentPrefs(userPref: UserPref | undefined) {

        if (! userPref) {
            return undefined;
        }

        const dictionaryPrefs = new DictionaryPrefs(userPref.value);
        return new FirebaseDatastorePrefs(dictionaryPrefs.toPrefDict());

    }

}
