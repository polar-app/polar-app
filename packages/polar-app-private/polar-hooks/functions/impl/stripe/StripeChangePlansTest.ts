import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "../util/Lazy";
import {StripeChangePlans} from "./StripeChangePlans";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

describe('StripeChangePlans', function() {

    this.timeout(30000);
    it("basic", async function() {

        const firebase = firebaseProvider();
        const auth = firebase.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io');

        await StripeChangePlans.changePlans({
            stripeMode: 'test',
            uid: user.uid,
            email: user.email!,
            plan: 'pro',
            interval: '4year'
        })

    });

});