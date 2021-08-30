import { FilePaths } from "polar-shared/src/util/FilePaths";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {AnswerIndexer} from "./AnswerIndexer";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";

xdescribe("AnswerIndexer", async function() {

    this.timeout(30000000);

    interface IOpts {
        readonly skipPages?: ReadonlyArray<PageNumber>;
    }

    async function getUserID() {

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        if (! user) {
            throw new Error("No user");
        }

        return user.uid;

    }

    async function doIndexDoc(path: string, docID: string, opts: IOpts = {}) {

        const url = FilePaths.toURL(path);

        const uid = await getUserID();

        await AnswerIndexer.doIndex({
            docID,
            uid,
            url,
            skipPages: opts.skipPages
        })

        console.log(`Done.  Finished importing docID: ${docID}: ${path}`);

    }

    it("basic", async function() {

        await doIndexDoc("/Users/burton/projects/polar-app/packages/polar-app-public/polar-answers/data/bigtable.pdf", '1234')
        await doIndexDoc("/Users/burton/projects/polar-app/packages/polar-app-public/polar-answers/data/two-doses-covid-vaccine.pdf", '2345')

        // await doIndexDoc("/Users/burton/us-history.pdf", '3456')
        // await doIndexDoc("/Users/burton/astronomy.pdf", '4567')
        // await doIndexDoc("/Users/burton/western-civ-2.pdf", '5678')
        // await doIndexDoc("/Users/burton/western-civ-3.pdf", '6789')
        // await doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910')

    });

    it("doc 3", async function() {

        // skipPages, 43, 44

        await doIndexDoc("/Users/burton/us-history-clean.pdf", '3456');

    });

    it("doc 4", async function() {

        await doIndexDoc("/Users/burton/astronomy.pdf", '4567')

    });


    it("doc 5", async function() {

        await doIndexDoc("/Users/burton/western-civ-2.pdf", '5678')

    });

    it("doc 6", async function() {

        await doIndexDoc("/Users/burton/western-civ-3.pdf", '6789')

    });

    it("doc 7", async function() {

        await doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910')

    });

})
