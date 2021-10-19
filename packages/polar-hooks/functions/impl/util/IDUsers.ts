import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {IProfile, ProfileCollection} from 'polar-firebase/src/firebase/om/ProfileCollection';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserIDStr } from 'polar-shared/src/util/Strings';
import {IUserRecord} from 'polar-rpc/src/IDUser'

export class IDUsers {

    // https://stackoverflow.com/questions/45215019/firebase-admin-sdk-current-logged-in-user-nodejs

    public static async fromIDToken(idToken: IDTokenStr): Promise<IDUser> {

        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const decodedIdToken = await auth.verifyIdToken(idToken);
        const uid = decodedIdToken.uid;

        const user = await auth.getUser(uid);

        if (! user) {
            throw new Error("No user for uid: " + uid);
        }

        if (! user.email) {
            throw new Error("No email for user: " + uid);
        }

        return await this.fromUser({
            uid: uid,
            email: user.email
        });

    }

    public static async fromUser(user: IUserRecord): Promise<IDUser> {

        const firestore = FirestoreAdmin.getInstance();

        const {uid} = user;
        const profile = await ProfileCollection.getByUserID(firestore, uid);

        return {uid, user, profile};

    }

}

export interface IDUser {

    readonly uid: UserIDStr;
    readonly user: IUserRecord;
    readonly profile: IProfile | undefined;

}

export type IDTokenStr = string;

