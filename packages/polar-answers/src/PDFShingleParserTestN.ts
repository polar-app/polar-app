import {PDFShingleParser} from "./PDFShingleParser";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {AssertionsCache} from "polar-test/src/test/AssertionsCache";

describe("PDFShingleParser", function() {

    this.timeout(60000)

    xit("basic", async () => {

        const url = FilePaths.toURL('/Users/burton/plusone.pdf')

        const result: string[] = [];

        await PDFShingleParser.parse({url, filterCompleteSentences: true}, async (event) => {

            const {shingles} = event;

            result.push(JSON.stringify(shingles, null, '  '));

        })

        await AssertionsCache.writeToCache(result.join("\n"), 'plus-one-shingles', 'txt');

    });

})
