import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

export namespace AnswerTests {

    export async function getUID(forEmail = 'burton@inputneuron.io') {

        const app = FirebaseAdmin.app()
        const auth = app.auth();
        const user = await auth.getUserByEmail(forEmail)

        if (!user) {
            throw new Error("no user");
        }

        return user.uid;

    }

}
