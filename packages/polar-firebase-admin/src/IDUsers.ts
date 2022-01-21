import {FirebaseAdmin} from './FirebaseAdmin';
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

        const {uid} = user;

        return {uid, user};

    }

}

export interface IDUser {

    readonly uid: UserIDStr;
    readonly user: IUserRecord;

}

export type IDTokenStr = string;

