import {DictionaryPrefs, Prefs, StringToStringDict} from "../../util/prefs/Prefs";
import {Collections, UserIDStr} from "../sharing/db/Collections";
import {Firebase} from "../../firebase/Firebase";
import {Preconditions} from "polar-shared/src/Preconditions";

export class UserPrefs {

    private static COLLECTION = 'pref';

    private static async getUserID(): Promise<UserIDStr> {
        const user = Preconditions.assertPresent(await Firebase.currentUser());
        return user.uid;
    }

    public static async get(): Promise<Prefs> {

        const userID  = await this.getUserID();

        const userPref: UserPref | undefined = await Collections.getByID(this.COLLECTION, userID);

        if (userPref) {
            return new DictionaryPrefs(userPref.value);
        }

        return new DictionaryPrefs();

    }

    public static async set(prefs: Prefs) {
        const userID  = await this.getUserID();
        const ref = await Collections.createRef(this.COLLECTION, userID);

        const userPref: UserPref = {
            value: prefs.toDict()
        };

        await ref.set(userPref);

    }

}

export interface UserPref {
    readonly value: StringToStringDict;
}
