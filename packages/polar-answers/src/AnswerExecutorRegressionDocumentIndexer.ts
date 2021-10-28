import {FilePaths} from "polar-shared/src/util/FilePaths";
import {AnswerIndexer} from "./AnswerIndexer";
import * as path from "path";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;

async function main() {

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

    const promises = [
        doIndexDoc("data/bigtable.pdf", '1234'),
        doIndexDoc("data/two-doses-covid-vaccine.pdf", '2345'),
        doIndexDoc("/Users/burton/us-history.pdf", '3456'),
        doIndexDoc("/Users/burton/astronomy.pdf", '4567'),
        doIndexDoc("/Users/burton/western-civ-2.pdf", '5678'),
        doIndexDoc("/Users/burton/western-civ-3.pdf", '6789'),
        doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910'),
        doIndexDoc("/Users/burton/us-history-clean.pdf", '3456'),
        doIndexDoc("/Users/burton/astronomy.pdf", '4567'),
        doIndexDoc("/Users/burton/western-civ-2.pdf", '5678'),
        doIndexDoc("/Users/burton/western-civ-3.pdf", '6789'),
        doIndexDoc("/Users/burton/history-in-the-making-united-states.pdf", '78910'),
        doIndexDoc(
            path.resolve(__dirname, '../data/Elmer_Candy_Corporation.pdf'),
            '78911',
        ),
        doIndexDoc(
            path.resolve(__dirname, '../data/Visa_policy_of_Venezuela.pdf'),
            '78912',
        ),
    ]

    console.log("Indexing all docs in parallel.... ");
    await Promise.all(promises);
    console.log("Indexing all docs in parallel.... done");

}

main()
    .catch(err => console.error(err));
