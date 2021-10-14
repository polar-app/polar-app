import {FilePaths} from "polar-shared/src/util/FilePaths";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {AnswerIndexer} from "./AnswerIndexer";
import * as path from "path";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;

describe("AnswerIndexer", function() {

    this.timeout(30000000);

    const app = FirebaseAdmin.app()

    interface IOpts {
        readonly skipPages?: ReadonlyArray<PageNumber>;
    }

    async function doIndexDoc(path: string, docID: string, opts: IOpts = {}) {
        console.log(`Indexing document from path ${path} with docID ${docID} inside ES index`);

        const url = FilePaths.toURL(path);

        const uid = await getUID();

        await AnswerIndexer.doIndex({
            docID,
            uid,
            url,
            skipPages: opts.skipPages
        })

        console.log(`Done.  Finished importing docID: ${docID}: ${path}`);

    }

    xit("basic bigtable", async function () {

        await doIndexDoc("data/bigtable.pdf", '1234')

    });

    xit("basic", async function () {

        // await doIndexDoc("data/bigtable.pdf", '1234')
        // await doIndexDoc("data/two-doses-covid-vaccine.pdf", '2345')

        // await doIndexDoc("/Users/burton/us-history.pdf", '3456')
        // await doIndexDoc("/Users/burton/astronomy.pdf", '4567')
        // await doIndexDoc("/Users/burton/western-civ-2.pdf", '5678')
        // await doIndexDoc("/Users/burton/western-civ-3.pdf", '6789')
        // await doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910')

    });

    xit("doc 3", async function() {

        // skipPages, 43, 44

        await doIndexDoc("/Users/burton/us-history-clean.pdf", '3456');

    });

    xit("doc 4", async function() {

        await doIndexDoc("/Users/burton/astronomy.pdf", '4567')

    });


    xit("doc 5", async function() {

        await doIndexDoc("/Users/burton/western-civ-2.pdf", '5678')

    });

    xit("doc 6", async function() {

        await doIndexDoc("/Users/burton/western-civ-3.pdf", '6789')

    });

    xit("doc 7", async function() {

        await doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910')


    });

    xit('Index Elmer_Candy_Corporation.pdf', async () => {
        await doIndexDoc(
            path.resolve(__dirname, '../data/Elmer_Candy_Corporation.pdf'),
            '78911',
        )
    })

    xit('index Visa_policy_of_Venezuela.pdf', async () => {
        await doIndexDoc(
            path.resolve(__dirname, '../data/Visa_policy_of_Venezuela.pdf'),
            '78912',
        )
    })

})
