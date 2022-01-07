import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "polar-shared/src/util/Lazy";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

async function exec() {

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    // gets the first command line argument
    const email = process.argv.slice(2)[0];

    if (! email) {
        throw new Error("This command requires an email as argument to generate a valid token");
    }

    const user = await auth.getUserByEmail(email);

    if (! user) {
        throw new Error("No user for email: " + email);
    }

    const customToken = await auth.createCustomToken(user.uid);

    console.log("custom token: " +  customToken);

    console.log("Use the following link to login:");

    console.log("https://app.getpolarized.io/login-with-custom-token?token=" + customToken);
}

exec().catch(err => console.error(err));
