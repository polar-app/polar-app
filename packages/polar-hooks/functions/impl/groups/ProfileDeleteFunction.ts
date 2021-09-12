import {IDUser} from '../util/IDUsers';
import {ProfileOwners} from './db/ProfileOwners';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {ProfileHandles} from './db/ProfileHandles';
import {UserRequests} from '../util/UserRequests';
import {ProfileCollection} from "polar-firebase/src/firebase/om/ProfileCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class ProfileDeleteFunctions {

    public static async exec(idUser: IDUser,
                             request: ProfileDeleteRequest) {

        const firestore = FirestoreAdmin.getInstance();

        const batch = firestore.batch();

        if (! idUser.profile) {
            throw new Error("No profile");
        }

        const profileID = idUser.profile.id;

        const profile = await ProfileCollection.get(firestore, profileID);

        if (profile) {

            await ProfileOwners.delete(batch, idUser.uid);
            await ProfileCollection.doDelete(firestore, batch, profileID);

            if (profile.handle) {
                ProfileHandles.delete(batch, profile.handle);
            }

        }


        await batch.commit();

    }

}

/**
 * Creates or re-provisions a group for document sharing.
 */
export const ProfileDeleteFunction = ExpressFunctions.createHook('ProfileDeleteFunction', (req, res) => {
    return UserRequests.execute(req, res, ProfileDeleteFunctions.exec);
});

export interface ProfileDeleteRequest {
}
