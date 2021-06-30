import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import * as admin from 'firebase-admin';
import UserRecord = admin.auth.UserRecord;
import {UserIDStr} from 'polar-firebase/src/firebase/om/Profiles';

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
        // const profileID = await ProfileUpdates.getOrCreateProfile(uid, user);

        return {uid, user};
    }

}

export interface IDUser {

    readonly uid: UserIDStr;
    readonly user: UserRecord;

}

export type IDTokenStr = string;

