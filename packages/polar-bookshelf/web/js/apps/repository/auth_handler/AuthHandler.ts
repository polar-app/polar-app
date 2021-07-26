import {URLs} from 'polar-shared/src/util/URLs';
import {Firebase} from '../../../firebase/Firebase';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Billing} from "polar-accounts/src/Billing";
import {Account} from "../../../accounts/Account";
import {Accounts} from "../../../accounts/Accounts";
import {SignInSuccessURLs} from "../../../../../apps/repository/js/login/SignInSuccessURLs";
import firebase from 'firebase/app'
import {Firestore} from "../../../firebase/Firestore";
import {AppSites} from "./AppSites";

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

}


function computeBaseURL() {

    // TODO: this could use origin...
    const base = URLs.toBase(document.location!.href);

    if (! AppSites.isApp(base)) {
        return 'https://app.getpolarized.io';
    } else {
        return base;
    }

}

export class AuthHandlers {

    public static get(): AuthHandler {
        return new BrowserAuthHandler();
    }

}

abstract class DefaultAuthHandler implements AuthHandler {

    readonly id: string = 'default';

    public abstract authenticate(): void;

    public async userInfo(): Promise<Optional<UserInfo>> {
        return Optional.empty();
    }

    public abstract status(): Promise<AuthStatus>;

}

export function toUserInfo(user: firebase.User, account: Account | undefined): UserInfo {

    const createSubscription = (): Billing.Subscription => {

        if (account) {

            if (account.trial?.expires) {

                const now = ISODateTimeStrings.create();
                if (ISODateTimeStrings.compare(now, account.trial.expires) === -1) {
                    return {
                        plan: Billing.V2PlanPro,
                        interval: 'month',
                        trial: account.trial,
                    };
                }
            }

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

    /**
     * @Deprecated useUserInfoContext
     */
    public async userInfo(): Promise<Optional<UserInfo>> {

        Firebase.init();

        const user = await this.currentUser();

        if (! user) {
            console.warn("No user");
            return Optional.empty();
        }

        const account = await Accounts.get();

        return Optional.of(toUserInfo(user, account));

    }

    protected async currentUser(): Promise<firebase.User | null> {
        return await Firebase.currentUserAsync();
    }

}

export class BrowserAuthHandler extends FirebaseAuthHandler {

    readonly id: string = 'browser';

    public async authenticate(signInSuccessUrl?: string): Promise<void> {

        Firebase.init();

        function createLoginURL() {
            const base = computeBaseURL();
            const target = new URL('/login', base).toString();
            return SignInSuccessURLs.createSignInURL(signInSuccessUrl, target);
        }

        const newLocation = createLoginURL();

        console.log("Redirecting to authenticate: " + newLocation);

        // TODO useHistory here to push so that the app doesn't have to
        // reload but the problem is that we need to use hooks for this...

        Firestore.terminateAndRedirect(newLocation)
            .catch(err => console.error(err));

    }

    public async status(): Promise<AuthStatus> {

        Firebase.init();

        const user = await this.currentUser();

        if (user === null) {
            return {
                user: undefined,
                type: 'needs-authentication'
            };
        }

        return {
            user,
            type: 'authenticated'
        };

    }

}

export type AuthType = 'needs-authentication' | 'authenticated';

export interface AuthStatus {
    readonly user: firebase.User | undefined;
    readonly type: AuthType;
}

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
    readonly subscription: Billing.Subscription;

}
