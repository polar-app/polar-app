import {DictionaryPrefs, PersistentPrefs, StringToStringDict} from "../../util/prefs/Prefs";
import { UserPrefs } from "./UserPrefs";

export class FirestorePrefs extends DictionaryPrefs implements PersistentPrefs {

    constructor(delegate: StringToStringDict = {}) {
        super(delegate);
    }

    public async init() {
        const prefs = await UserPrefs.get();
        this.delegate = prefs.toDict();
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this)
    }

}
