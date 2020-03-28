import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;

const app = FirebaseAdmin.app();
const auth = app.auth();

const LIMIT = 1000;

export class UserPager {

    private hasFirst: boolean = false;
    private nextPageToken: string | undefined;

    /**
     * True when we have a next page.
     */
    private _hasNext: boolean = true;

    public async hasNext(): Promise<boolean> {
        return this._hasNext;
    }

    public async next(): Promise<ReadonlyArray<UserRecord>> {

        console.log("Fetching batch of users...");
        const listUsersResult = await auth.listUsers(LIMIT, this.nextPageToken);
        console.log("Fetching batch of users...done");

        this.nextPageToken = listUsersResult.pageToken;

        this._hasNext = listUsersResult.users.length === LIMIT;

        return listUsersResult.users;

    }

}
