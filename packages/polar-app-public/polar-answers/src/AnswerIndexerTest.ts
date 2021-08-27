import { FilePaths } from "polar-shared/src/util/FilePaths";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {AnswerIndexer} from "./AnswerIndexer";

describe("AnswerIndexer", async function() {

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

        console.log("Done.  Finished importing docID: " + docID);

    }

    it("basic", async function() {

        await doIndexDoc("/Users/burton/projects/polar-app/packages/polar-app-public/polar-answers/data/bigtable.pdf", '1234')
        // await doIndexDoc("/Users/burton/projects/polar-app/packages/polar-app-public/polar-answers/data/two-doses-covid-vaccine.pdf", '2345')

        // await doIndexDoc("/Users/burton/us-history.pdf", '3456')
        // await doIndexDoc("/Users/burton/astronomy", '4567')
        // await doIndexDoc("/Users/burton/western-civ-2.pdf", '5678')
        // await doIndexDoc("/Users/burton/western-civ-3.pdf", '6789')
        // await doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910')


    });

})
