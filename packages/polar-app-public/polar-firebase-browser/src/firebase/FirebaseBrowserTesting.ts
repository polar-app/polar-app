import {FirebaseBrowser} from "./FirebaseBrowser";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";

export namespace FirebaseBrowserTesting {

    async function authWithUser(user: string, pass: string) {

        const app = FirebaseBrowser.init();

        const auth = app.auth();

        await auth.signInWithEmailAndPassword(user, pass);

        return auth.currentUser;

    }

    export async function authWithUser0() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER, FirebaseTestingUsers.FIREBASE_PASS);
    }

    export async function authWithUser1() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER1, FirebaseTestingUsers.FIREBASE_PASS1);
    }

    export async function authWithUser2() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER2, FirebaseTestingUsers.FIREBASE_PASS2);
    }

}
