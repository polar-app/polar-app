import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ProfileOwners} from './db/ProfileOwners';
import {ProfileHandles} from './db/ProfileHandles';
import {TagsValidator} from './rpc/TagsValidator';
import * as admin from 'firebase-admin';
import {Image} from './db/Images';
import UserRecord = admin.auth.UserRecord;
import {Arrays} from "polar-shared/src/util/Arrays";
import {IProfileUpdate, ProfileIDStr, Profiles, UserIDStr} from "polar-firebase/src/firebase/om/Profiles";

export class ProfileUpdates {

    public static async exec(idUser: IDUser, update: IProfileUpdate): Promise<ProfileUpdateResponse> {
        return await ProfileUpdates.doExec(idUser.uid, idUser.user, update);

    }

    public static async doExec(uid: UserIDStr,
                               user: UserRecord,
                               update: IProfileUpdate): Promise<ProfileUpdateResponse> {

        TagsValidator.validate(Arrays.toArray(update.tags));

        const firestore = Firestore.getInstance();

        const batch = firestore.batch();

        // see if the user has an existing profile...

        const profileOwner = await ProfileOwners.get(uid);

        const profileID = profileOwner ? profileOwner.profileID : Profiles.createID();

        if (profileOwner && profileOwner.handle) {
            // the previous handle has to be deleted as the user is changing
            // their handle to a new one.
            ProfileHandles.delete(batch, profileOwner.handle);
        }

        if (update.handle) {

            ProfileHandles.create(batch, update.handle, {
                profileID
            });

        }

        if (! user.email) {
            throw new Error("User has no email");
        }

        ProfileOwners.set(batch, uid, {
            profileID,
            email: user.email!,
            uid,
            handle: update.handle
        });

        Profiles.set(firestore, batch, profileID, user, update);

        await batch.commit();

        return {id: profileID};

    }

    // public static async getOrCreateProfile(uid: UserIDStr, user: UserRecord): Promise<ProfileIDStr> {
    //
    //     const profileOwner = await ProfileOwners.get(uid);
    //
    //     if (profileOwner) {
    //         return profileOwner.profileID;
    //     } else {
    //         const request = ProfileUpdateRequests.fromUser(user);
    //         const {id} = await ProfileUpdates.doExec(uid, user, request);
    //         return id;
    //     }
    //
    // }

}

export interface ProfileUpdateResponse {
    readonly id: ProfileIDStr;
}

export class ProfileUpdateRequests {

    // public static fromUser(user: UserRecord): IProfileUpdate {
    //
    //     const image: Image | undefined = user!.photoURL ? {url: user!.photoURL, size: null} : undefined;
    //
    //     return {
    //         name: user.displayName,
    //         image
    //     };
    // }

}
