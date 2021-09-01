import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {ThreadingExecutor} from "./ThreadingExecutor";

describe("ThreadingExecutor", async function() {

    this.timeout(30000000);

    async function getUID() {

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        if (! user) {
            throw new Error("no user");
        }

        return user.uid;

    }

    it("basic", async function() {

        const uid = await getUID();

        const res = await ThreadingExecutor.execute({type: 'doc', uid, docIDs: ['3456']})
        console.log('res: ', JSON.stringify(res, null, '  '));


    });


})