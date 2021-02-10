import {Profiles} from './db/Profiles';
import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ProfileOwners} from './db/ProfileOwners';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {ProfileHandles} from './db/ProfileHandles';
import {UserRequests} from '../util/UserRequests';

export class ProfileDeleteFunctions {

    public static async exec(idUser: IDUser,
                             request: ProfileDeleteRequest) {

        const firestore = Firestore.getInstance();

        const batch = firestore.batch();

        const profileID = idUser.profileID;
        const profile = await Profiles.get(profileID);

        if (profile) {

            await ProfileOwners.delete(batch, idUser.uid);
            await Profiles.delete(batch, profileID);

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
