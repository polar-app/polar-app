import { FilePaths } from "polar-shared/src/util/FilePaths";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {AnswerIndexer} from "./AnswerIndexer";

xdescribe("AnswerIndexer", async function() {

    this.timeout(300000);

    it("basic", async function() {

        const url = FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-app-public/polar-answers/data/two-doses-covid-vaccine.pdf");

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        if (! user) {
            throw new Error("No user");
        }

        await AnswerIndexer.doIndex({
            docID: '2345',
            uid: user.uid,
            url
        })

    });

})
