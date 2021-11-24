import firebase from 'firebase/app'
import 'firebase/auth';

export namespace FirebaseAuth {

    export async function loginWithCustomToken(customToken: string) {

        const auth = firebase.auth();

        return await auth.signInWithCustomToken(customToken);

    }

}
