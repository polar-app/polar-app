import {Collections, UserIDStr} from "polar-firestore-like/src/Collections";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

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
            const ref = await Collections.createRef(await FirestoreBrowserClient.getInstance(), COLLECTION, key);
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
