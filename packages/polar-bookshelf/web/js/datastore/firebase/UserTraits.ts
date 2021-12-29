import {UserIDStr} from "polar-shared/src/util/Strings";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";


/**
 * @deprecated Replace with packages/polar-firebase-users/src/UserTraits.ts since this logic doesn't belong to polar-bookshelf and that other one works on both the server and the browser
 */
export namespace UserTraits {

    const COLLECTION = 'user_trait';

    async function getUserID(): Promise<UserIDStr | undefined> {

        const user = await FirebaseBrowser.currentUserAsync();
        return user?.uid;

    }

    export type UserTraitMap = {[key: string]: string};

    export async function write(traits: UserTraitMap) {

        const uid  = await getUserID();

        if (! uid) {
            return;
        }

        const userTraits: ReadonlyArray<IUserTrait> = Object.entries(traits)
                                                            .map(current => {
            return {
                uid,
                name: current[0],
                value: current[1]
            };
        })

        const promises = userTraits.map(async (current) => {

            const key = Hashcodes.createID({uid, name: current.name});
            const firestore = await FirestoreBrowserClient.getInstance();

            const ref = Collections.createRef(firestore, COLLECTION, key);
            await ref.set(current);

        });

        await Promise.all(promises);

    }

}

export interface IUserTrait {
    readonly uid: UserIDStr;
    readonly name: string;
    readonly value: string;
}
