import {UserIDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

export namespace UserPrefCollection {

    export const COLLECTION_NAME = 'user_pref';

    /**
     * Create empty user prefs for this user so there is at least one pref.
     *
     * This is needed for a Firestore workaround with needing to have at east
     * ONE pref to get an empty snapshot.
     */
    export async function initForUser<SM = unknown>(firestore: IFirestore<SM>,
                                                    uid: UserIDStr) {

        const ref = firestore.collection(COLLECTION_NAME).doc(uid);

        const userPref: IUserPref = {
            uid,
            value: {}
        };

        await ref.set(userPref);

    }
}

export interface IPref {

    /**
     * The key for this pref
     */
    readonly key: string;

    /**
     * The value of this pref.
     */
    readonly value: string;

    /**
     * The time this pref was written.
     */
    readonly written: ISODateTimeString;

}

export interface StringToPrefDict {
    [key: string]: IPref;
}

export interface IUserPref {
    readonly uid: UserIDStr;
    readonly value: StringToPrefDict;
}
