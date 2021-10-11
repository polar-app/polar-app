import {PDFShingleParser} from "./PDFShingleParser";
import {Numbers} from "polar-shared/src/util/Numbers";
import {FilePaths} from "polar-shared/src/util/FilePaths";

describe("PDFShingleParser", function() {

    xit("basic", async () => {

        const targetPage = 291
        const skipPages = Numbers.range(1, targetPage);
        const maxPages = targetPage + 2;

        // await PDFText.getText('/Users/burton/astronomy.pdf', dumpTextContent, {
        // });

        const url = FilePaths.toURL('/Users/burton/astronomy.pdf')

        await PDFShingleParser.parse({url, skipPages, maxPages}, async (event) => {

            const {shingles} = event;

            console.log(shingles)

        })

    });

})
