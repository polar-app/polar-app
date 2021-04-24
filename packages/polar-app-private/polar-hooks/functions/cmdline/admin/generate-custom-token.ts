import {Lazy} from "../../impl/util/Lazy";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

async function exec() {

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    const email = 'babstar99@gmail.com';
    const user = await auth.getUserByEmail(email);

    if (! user) {
        throw new Error("No user for email: " + email);
    }

    const customToken = await auth.createCustomToken(user.uid);

    console.log("custom token: " +  customToken);

    // const link = await auth.generateSignInWithEmailLink('burton@inputneuron.io', {
    //     url: 'https://app.getpolarized.io',
    // })
    //
    // console.log('Use the following link to login: ')
    // console.log(link);

}

exec().catch(err => console.error(err));
