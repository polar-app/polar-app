import {
    DictionaryPrefs,
    PersistentPrefs,
    StringToPrefDict
} from "../../util/prefs/Prefs";
import {UserPref, UserPrefCallback, UserPrefs} from "./UserPrefs";
import {Firestore} from "../../firebase/Firestore";
import {Firebase} from "../../firebase/Firebase";
import {Latch} from "polar-shared/src/util/Latch";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    OnErrorCallback,
    SnapshotUnsubscriber
} from 'polar-shared/src/util/Snapshots';

export class FirebaseDatastorePrefs extends DictionaryPrefs implements PersistentPrefs {

    private firestore: firebase.firestore.Firestore | undefined;
    private user: firebase.User | undefined;

    private initLatch = new Latch<boolean>();

    constructor(delegate: StringToPrefDict = {}) {
        super(delegate);
    }

    public async init() {

        this.firestore = await Firestore.getInstance();
        this.user = (await Firebase.currentUserAsync())!;

        function onError(err: Error) {
            console.error("Unable to read user prefs:", err);
        }

        function toDictionaryPrefs(userPref: UserPref | undefined) {

            if (userPref) {
                return new DictionaryPrefs(userPref.value);
            }

            return new DictionaryPrefs();

        }

        this.onSnapshot(userPref => {

            const prefDict = toDictionaryPrefs(userPref);
            this.update(prefDict.toPrefDict());

        }, onError);

        this.initLatch.resolve(true);

    }

    public onSnapshot(onNext: UserPrefCallback, onError: OnErrorCallback = NULL_FUNCTION): SnapshotUnsubscriber {

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



