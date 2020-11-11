import { Optional } from 'polar-shared/src/util/ts/Optional';
import { ISODateTimeString } from 'polar-shared/src/metadata/ISODateTimeStrings';
import { Billing } from "polar-accounts/src/Billing";
import { Account } from "../../../accounts/Account";
export interface AuthHandler {
    readonly id: string;
    authenticate(signInSuccessUrl?: string): void;
    status(): Promise<AuthStatus>;
    userInfo(): Promise<Optional<UserInfo>>;
}
export declare class AuthHandlers {
    static get(): AuthHandler;
}
declare abstract class DefaultAuthHandler implements AuthHandler {
    readonly id: string;
    abstract authenticate(): void;
    userInfo(): Promise<Optional<UserInfo>>;
    abstract status(): Promise<AuthStatus>;
}
export declare function toUserInfo(user: firebase.User, account: Account | undefined): UserInfo;
export declare abstract class FirebaseAuthHandler extends DefaultAuthHandler {
    userInfo(): Promise<Optional<UserInfo>>;
    protected currentUser(): Promise<firebase.User | undefined>;
}
export declare class BrowserAuthHandler extends FirebaseAuthHandler {
    readonly id: string;
    authenticate(signInSuccessUrl?: string): Promise<void>;
    status(): Promise<AuthStatus>;
}
export declare type AuthType = 'needs-authentication' | 'authenticated';
export interface AuthStatus {
    readonly user: firebase.User | undefined;
    readonly type: AuthType;
}
export interface UserInfo {
    readonly displayName?: string;
    readonly email: string;
    readonly emailVerified: boolean;
    readonly photoURL?: string;
    readonly uid: string;
    readonly creationTime: ISODateTimeString;
    readonly subscription: Billing.Subscription;
}
export {};
