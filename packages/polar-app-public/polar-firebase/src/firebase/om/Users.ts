import {IUserRecord} from "polar-firestore-like/src/IUserRecord";

export class Users {

    public static createImage(user: IUserRecord): Image | undefined {
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
