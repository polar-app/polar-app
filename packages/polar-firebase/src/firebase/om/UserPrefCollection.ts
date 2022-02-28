import {IDStr, UIDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
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
                                                    uid: UIDStr) {

        const ref = firestore.collection(COLLECTION_NAME).doc(uid);

        const now = ISODateTimeStrings.create();

        const userPref: IUserPref = {
            id: uid,
            uid,
            value: {
                // Enable Fixed-Width ePUBs by default for every user who is init-ed
                'fixed-width-epub': {
                    key: 'fixed-width-epub',
                    value: 'true',
                    written: now,
                },
                'dark-mode-pdf': {
                    key: 'dark-mode-pdf',
                    value: 'natural',
                    written: now,
                },
                'settings-auto-resume': {
                    key: 'settings-auto-resume',
                    value: 'true',
                    written: now,
                }
            }
        };

        await ref.set(userPref);

    }

    export async function doDelete<SM = unknown>(firestore: IFirestore<SM>,
                                                 uid: UIDStr) {

        const ref = firestore.collection(COLLECTION_NAME).doc(uid);

        await ref.delete();

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
    readonly id: IDStr;
    readonly uid: UIDStr;
    readonly value: StringToPrefDict;
}
