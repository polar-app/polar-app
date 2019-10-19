import {FirebaseAdmin} from "../util/FirebaseAdmin";
import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;

const app = FirebaseAdmin.app();
const auth = app.auth();

export class UserPager {

    private hasFirst: boolean = false;
    private nextPageToken: string | undefined;

    public async hasNext(): Promise<boolean> {
        return ! this.hasFirst || this.nextPageToken !== undefined;
    }

    public async next(): Promise<ReadonlyArray<UserRecord>> {

        console.log("Fetching batch of users...");
        const listUsersResult = await auth.listUsers(1000, this.nextPageToken);
        console.log("Fetching batch of users...done");

        this.nextPageToken = listUsersResult.pageToken;

        return listUsersResult.users;

    }

}
