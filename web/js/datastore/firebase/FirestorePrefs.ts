import {DictionaryPrefs, PersistentPrefs, StringToPrefDict} from "../../util/prefs/Prefs";
import {UserPrefs} from "./UserPrefs";

export class FirestorePrefs extends DictionaryPrefs implements PersistentPrefs {

    constructor(delegate: StringToPrefDict = {}) {
        super(delegate);
    }

    public async init() {
        const prefs = await UserPrefs.get();
        this.update(prefs.toPrefDict());
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

}
