import {URLs} from '../../../util/URLs';
import {Firebase} from '../../../firebase/Firebase';
import * as firebase from '../../../firebase/lib/firebase';
import {AppRuntime} from '../../../AppRuntime';

export interface AuthHandler {

    authenticate(): Promise<void>;

    status(): Promise<AuthStatus>;

}

export class AuthHandlers {

    public static get(): AuthHandler {

        if (AppRuntime.isElectron()) {

            return new ElectronAuthHandler();

        } else if (AppRuntime.isBrowser()) {

            return new BrowserAuthHandler();

        } else {
            throw new Error("No auth handler.");
        }

    }

}

abstract class DefaultAuthHandler implements AuthHandler {

    public async authenticate(): Promise<void> {

        const base = URLs.toBase(document.location!.href);
        const newLocation = new URL('/apps/repository/login.html', base).toString();

        window.location.href = newLocation;

    }

    public abstract status(): Promise<AuthStatus>;

}

export class BrowserAuthHandler extends DefaultAuthHandler {

    public async status(): Promise<AuthStatus> {

        Firebase.init();

        if (await this.currentUser() === null) {
            return 'needs-authentication';
        }

        return undefined;

    }

    private async currentUser(): Promise<firebase.User | null> {

        return new Promise<firebase.User | null>((resolve, reject) => {

            const unsubscribe = firebase.auth()
                .onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                },
                (err) => {
                    unsubscribe();
                    reject(err);
                });

        });

    }

}

export class ElectronAuthHandler extends DefaultAuthHandler {

    public async status(): Promise<AuthStatus> {

        return undefined;

    }

}


export type AuthStatus = 'needs-authentication' |  undefined;

