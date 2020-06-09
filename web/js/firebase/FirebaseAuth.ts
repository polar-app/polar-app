import * as firebase from './lib/firebase';
import { Firebase } from './Firebase';

export namespace FirebaseAuth {

    export async function signInWithAuthToken(authToken: string) {
        const app = Firebase.init();
        const auth = app.auth();
        const credential = firebase.auth.GoogleAuthProvider.credential(null, authToken);
        await auth.signInWithCredential(credential);
    }

}
