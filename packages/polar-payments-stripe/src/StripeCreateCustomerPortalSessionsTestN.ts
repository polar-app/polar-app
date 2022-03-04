import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";

describe("StripeCreateCustomerPortalSessions", function () {

    it("basic", async () => {

        const email = 'login@beuk.email';

        const firebase = FirebaseAdmin.app();
        const auth = firebase.auth();

        const user = await auth.getUserByEmail(email);

        const uid = user.uid;

        const idUser = {
            uid,
            user: {
                uid,
                email
            }
        }

        await StripeCreateCustomerPortalSessions.create(idUser, {stripeMode: 'test'});

    });

})
