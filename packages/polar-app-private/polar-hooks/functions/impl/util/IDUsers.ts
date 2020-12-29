import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import * as admin from 'firebase-admin';
import {UserIDStr} from '../groups/db/Profiles';
import {ProfileIDStr} from '../groups/db/Profiles';
import {ProfileUpdates} from '../groups/ProfileUpdates';
import UserRecord = admin.auth.UserRecord;

export class IDUsers {

    // https://stackoverflow.com/questions/45215019/firebase-admin-sdk-current-logged-in-user-nodejs

    public static async fromIDToken(idToken: IDTokenStr): Promise<IDUser> {

        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const decodedIdToken = await auth.verifyIdToken(idToken);
        const uid = decodedIdToken.uid;

        const user = await auth.getUser(uid);

        return await this.fromUser(user);

    }

    public static async fromUser(user: UserRecord): Promise<IDUser> {
        const {uid} = user;
        const profileID = await ProfileUpdates.getOrCreateProfile(uid, user);

        return {uid, user, profileID};
    }

}

export interface IDUser {

    readonly profileID: ProfileIDStr;
    readonly uid: UserIDStr;
    readonly user: UserRecord;

}

export type IDTokenStr = string;

