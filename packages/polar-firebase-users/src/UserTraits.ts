import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export namespace UserTraits {
    type SingleTrait = {
        name: string,
        value: any,
    }

    export const store = async (uid: string, traits: SingleTrait[]) => {
        const promises = traits.map(async (current) => {
            const key = Hashcodes.createID({uid, name: current.name});
            await FirestoreAdmin.getInstance()
                .collection('user_traits')
                .doc(key)
                .set({
                    uid,
                    name: current.name,
                    value: current.value,
                });
        });

        await Promise.all(promises);
    }
}
