import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import * as admin from 'firebase-admin';
import UserRecord = admin.auth.UserRecord;
import {IProfile, Profiles, UserIDStr} from 'polar-firebase/src/firebase/om/Profiles';
import {Firestore} from "./Firestore";

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

        const firestore = Firestore.getInstance();

        const {uid} = user;
        const profile = await Profiles.getByUserID(firestore, uid);

        return {uid, user, profile};

    }

}

export interface IDUser {

    readonly uid: UserIDStr;
    readonly user: UserRecord;
    readonly profile: IProfile | undefined;

}

export type IDTokenStr = string;

