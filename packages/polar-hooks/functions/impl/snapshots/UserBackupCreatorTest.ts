import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "../util/Lazy";
import {UserBackupCreator} from "./UserBackupCreator";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

xdescribe('UserBackupCreator', function () {

    it("basic", async function () {

        const firebase = firebaseProvider();

        const auth = firebase.auth();

        const email = 'burton@inputneuron.io';
        const user = await auth.getUserByEmail(email);

        const uid = user!.uid;

        const {url} = await UserBackupCreator.create(uid);
        console.log("url: " + url);
    });

});
