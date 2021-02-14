import * as admin from 'firebase-admin';
import UserRecord = admin.auth.UserRecord;

export class Users {

    public static createImage(user: UserRecord): Image | undefined {
        return user!.photoURL ? {url: user!.photoURL, size: null} : undefined;
    }

}

export interface Image {
    readonly url: string;
    readonly size: Size | null;
}

export interface Size {
    readonly width: number;
    readonly height: number;
}
