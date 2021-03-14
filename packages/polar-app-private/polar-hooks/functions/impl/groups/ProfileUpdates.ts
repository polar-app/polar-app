import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ProfileOwners} from './db/ProfileOwners';
import {Profiles} from './db/Profiles';
import {ProfileInit} from './db/Profiles';
import {ProfileHandles} from './db/ProfileHandles';
import {TagsValidator} from './rpc/TagsValidator';
import * as admin from 'firebase-admin';
import {Image} from './db/Images';
import UserRecord = admin.auth.UserRecord;
import {ProfileIDStr} from './db/Profiles';
import {UserIDStr} from './db/Profiles';
import {Arrays} from "polar-shared/src/util/Arrays";

export class ProfileUpdates {

    public static async exec(idUser: IDUser, request: ProfileUpdateRequest): Promise<ProfileUpdateResponse> {
        return await ProfileUpdates.doExec(idUser.uid, idUser.user, request);

    }

    public static async doExec(uid: UserIDStr, user: UserRecord, request: ProfileUpdateRequest): Promise<ProfileUpdateResponse> {

        TagsValidator.validate(Arrays.toArray(request.tags));

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

        if (request.handle) {

            ProfileHandles.create(batch, request.handle, {
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
            handle: request.handle
        });

        Profiles.set(batch, profileID, user, request);

        await batch.commit();

        return {id: profileID};

    }

    public static async getOrCreateProfile(uid: UserIDStr, user: UserRecord): Promise<ProfileIDStr> {

        const profileOwner = await ProfileOwners.get(uid);

        if (profileOwner) {
            return profileOwner.profileID;
        } else {
            const request = ProfileUpdateRequests.fromUser(user);
            const {id} = await ProfileUpdates.doExec(uid, user, request);
            return id;
        }

    }

}

export interface ProfileUpdateRequest extends ProfileInit {

}

export interface ProfileUpdateResponse {
    readonly id: ProfileIDStr;
}

export class ProfileUpdateRequests {

    public static fromUser(user: UserRecord): ProfileUpdateRequest {

        const image: Image | undefined = user!.photoURL ? {url: user!.photoURL, size: null} : undefined;

        return {
            name: user.displayName,
            image
        };
    }

}
