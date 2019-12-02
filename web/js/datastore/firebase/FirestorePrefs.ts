import {DictionaryPrefs, PersistentPrefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserPrefs} from "./UserPrefs";
import {Firestore} from "../../firebase/Firestore";

export class FirestorePrefs extends DictionaryPrefs implements PersistentPrefs {

    private firestore: Firestore | undefined;

    constructor(delegate: StringToPrefDict = {}) {
        super(delegate);
    }

    public async init() {
        const prefs = await UserPrefs.get();
        this.update(prefs.toPrefDict());

        this.firestore = await Firestore.getInstance();

    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

}
