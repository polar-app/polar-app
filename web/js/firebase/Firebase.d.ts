import * as firebase from 'firebase/app';
import 'firebase/auth';
export declare class Firebase {
    private static app?;
    static init(): firebase.app.App;
    private static doInit;
    static currentUser(): firebase.User | undefined;
    static currentUserAsync(): Promise<firebase.User | null>;
    static currentUserID(): Promise<UserIDStr | undefined>;
}
export declare type UserIDStr = string;
export declare type UserID = UserIDStr;
