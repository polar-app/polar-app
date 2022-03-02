import {FirebaseBrowser} from "./FirebaseBrowser";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import fetchTokenRequest from "./fetchTokenRequest";

export namespace FirebaseBrowserTesting {

    async function authWithUser(user: string){

        const app = FirebaseBrowser.init();

        const auth = app.auth();

        const token = await fetchTokenRequest(user);

        const userCredential = await auth.signInWithCustomToken(token);

        if (! userCredential.user) {
            throw new Error("No user");
        }

        return userCredential.user;
    }

    export async function authWithUser0() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER);
    }

    export async function authWithUser1() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER1);
    }

    export async function authWithUser2() {
        return await authWithUser(FirebaseTestingUsers.FIREBASE_USER2);
    }

}
