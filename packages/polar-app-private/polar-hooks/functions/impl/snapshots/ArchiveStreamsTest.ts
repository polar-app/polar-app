import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "../util/Lazy";
import {ArchiveStreams} from "./ArchiveStreams";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

xdescribe('ArchiveStreams', function() {

    it("basic", async function() {

        const firebase = firebaseProvider();

        const auth = firebase.auth();

        const email = 'burton@inputneuron.io';
        const user = await auth.getUserByEmail(email);

        const uid = user!.uid;

        const {url} = await ArchiveStreams.create(uid);

        console.log("url: " + url);

    });

});
