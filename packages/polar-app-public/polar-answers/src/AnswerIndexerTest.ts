import { FilePaths } from "polar-shared/src/util/FilePaths";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {AnswerIndexer} from "./AnswerIndexer";

xdescribe("AnswerIndexer", async function() {

    this.timeout(30000000);

    async function doIndexDoc(path: string, docID: string) {

        const url = FilePaths.toURL(path);

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        if (! user) {
            throw new Error("No user");
        }

        await AnswerIndexer.doIndex({
            docID,
            uid: user.uid,
            url
        })

    }

    it("basic", async function() {

        // await doIndexDoc("data/bigtable.pdf", '1234')
        // await doIndexDoc("data/two-doses-covid-vaccine.pdf", '2345')

        // await doIndexDoc("/Users/burton/us-history.pdf", '3456')
        await doIndexDoc("/Users/burton/astronomy.pdf", '4567')


    });

})
