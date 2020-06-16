import {URLs} from 'polar-shared/src/util/URLs';
import {Firebase} from '../../../firebase/Firebase';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {accounts} from 'polar-accounts/src/accounts';
import {AccountProvider} from "../../../accounts/AccountProvider";
import {Account} from "../../../accounts/Account";

const POLAR_APP_SITES = [
    'http://localhost:8500',
    'http://127.0.0.1:8500',
    'https://app.getpolarized.io',
    'https://beta.getpolarized.io'
];

export interface AuthHandler {

    readonly id: string;

    /**
     *
     * @param signInSuccessUrl The URL to redirect to if we're logging in to a
     * specific portion of the app.
     */
    authenticate(signInSuccessUrl?: string): void;

    status(): Promise<AuthStatus>;

    userInfo(): Promise<Optional<UserInfo>>;

    /**
     * This operation requires authentication so redirect the user to login.
     *
     * @param signInSuccessUrl
     */
    requireAuthentication(signInSuccessUrl?: string): Promise<void>;

}


function computeBaseURL() {

    const base = URLs.toBase(document.location!.href);

    if (! POLAR_APP_SITES.includes(base)) {
        return 'https://app.getpolarized.io';
    } else {
        return base;
    }

}

export class AuthHandlers {

    public static get(): AuthHandler {
        return new BrowserAuthHandler();
    }

    public static async requireAuthentication(signInSuccessUrl?: string) {
        const authHandler = this.get();
        await authHandler.requireAuthentication(signInSuccessUrl);
    }

}

abstract class DefaultAuthHandler implements AuthHandler {

    readonly id: string = 'defaultd';

    public authenticate(signInSuccessUrl?: string): void {

        const createNewLocation = () => {

            if (signInSuccessUrl) {
                return signInSuccessUrl;
            }

            const base = computeBaseURL();

            return new URL('/apps/repository/login.html', base).toString();

        };

        const newLocation = createNewLocation();

        console.log("Redirecting to authenticate: " + newLocation);
        window.location.href = newLocation;

    }

    public async requireAuthentication(signInSuccessUrl?: string): Promise<void> {

        const userInfo = await this.userInfo();

        if (userInfo.isPresent()) {
            return;
        }

        this.authenticate(signInSuccessUrl);

    }

    public async userInfo(): Promise<Optional<UserInfo>> {
        return Optional.empty();
    }

    public abstract status(): Promise<AuthStatus>;

}

export function toUserInfo(user: firebase.User, account: Account | undefined): UserInfo {

    const createSubscription = (): accounts.Subscription => {

        if (account) {
            return {
                plan: account.plan,
                interval: account.interval || 'month'
            };
        } else {
            return {
                plan: 'free',
                interval: 'month'
            };
        }

    };

    const subscription = createSubscription();

    return {
        displayName: Optional.of(user.displayName).getOrUndefined(),
        email: Optional.of(user.email).get(),
        emailVerified: user.emailVerified,
        photoURL: Optional.of(user.photoURL).getOrUndefined(),
        uid: user.uid,
        creationTime: user.metadata.creationTime!,
        subscription
    };

}

export abstract class FirebaseAuthHandler extends DefaultAuthHandler {

    public async userInfo(): Promise<Optional<UserInfo>> {

        Firebase.init();

        const user = await this.currentUser();

        if (user === null) {
            console.log("FIXME: no current user");
            return Optional.empty();
        }

        const account = AccountProvider.get();

        return Optional.of(toUserInfo(user, account));

    }

    protected async currentUser(): Promise<firebase.User | null> {
        return await Firebase.currentUserAsync();
    }

}

export class BrowserAuthHandler extends FirebaseAuthHandler {

    readonly id: string = 'browser';

    public async authenticate(): Promise<void> {

        Firebase.init();

        const base = computeBaseURL();
        const newLocation = new URL('/login.html', base).toString();
        console.log("Redirecting to authenticate: " + newLocation);

        window.location.href = newLocation;

    }

    public async status(): Promise<AuthStatus> {

        Firebase.init();

        if (await this.currentUser() === null) {
            return 'needs-authentication';
        }

        return undefined;

    }

}

export class ElectronAuthHandler extends FirebaseAuthHandler {

    public async status(): Promise<AuthStatus> {

        return undefined;

    }

}

export type AuthStatus = 'needs-authentication' |  undefined;

/**
 * A generic UserInfo object for this auth handler. If there's no email the user
 * is anonymous and hasn't yet created an account.
 */
export interface UserInfo {

    readonly displayName?: string;
    readonly email: string;
    readonly emailVerified: boolean;
    readonly photoURL?: string;
    readonly uid: string;

    /**
     * The time the account was created on our end.
     */
    readonly creationTime: ISODateTimeString;

    /**
     * The users subscription level.
     */
    readonly subscription: accounts.Subscription;

}
