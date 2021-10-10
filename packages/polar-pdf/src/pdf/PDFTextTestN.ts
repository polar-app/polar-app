import {PDFText, PDFTextWordMerger} from "./PDFText";
import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import IPDFTextContent = PDFText.IPDFTextContent;
import IPDFTextWord = PDFTextWordMerger.IPDFTextWord;
import {Numbers} from "polar-shared/src/util/Numbers";

// TODO:
//
// I think it should be possible to build a function that can intelligently
// extract text, on the backend, from the PDF document directly.
//
// The following is needed I think:
//
// - Take all the text, and merge the items based on their position to determine
//   if a space should be between them.
//
// - Merge them into one large object with each line of text merged including,
//   ideally, its bounding box.
//
// - Do this per page and we don't need to do it as a stream, we can group on
//   the y index of each item then join those base on spaces, and new lines are \n
//
// - we have some words that have extra spaces due to them being different glyphs
//
// -

describe('PDFText', function() {

    const dumpTextContent = async (pdfTextContent: IPDFTextContent) => {
        const {extract, pageNum} = pdfTextContent;

        const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

        console.log("pdfTextContent: ", JSON.stringify(pdfTextContent, null, '  '))

        console.log("pageNum: ", pageNum);
        console.log("content: \n", content)

    };

    it("basic read", async function () {

        // TODO: still missing characters like:

        // tion 6 describes some of the re nements that we made
        //   - this might be a unicode char ?
        //
        // - we need to join words with hyphens into their original text... but
        //   maybe also keep the hyphenated text too.
        //
        //      - I think we can handle this by making have a set of mutations
        //        that show which offset words were joined and re-hyphenated so
        //        that we can reconstruct the original text or have split /
        //        hyphen points.
        //
        //      - We're also, arguably, going to need a way to keep the original
        //        boxes but I think we could just also anchor just on the raw text
        //
        //      - MAYBE I just index both forms / but I'm not sure if ES can do
        //        this for me. Basically, the idea is to implement BOTH forms as
        //        terms but not sure...

        // Write this in my standup and we should implement it soon:
        //
        // - Built out a framework for extracting PDF text from documents for PoC of AI.
        // The major blocker is actually hyphenation and whether we store metadata about
        // the regions of text and where they are located in the document.  What I'm
        // thinking of doing is storing a 'hyphen' map to document where the chars are
        // split, and what split char is used. Sometimes, they don't use the normal '-'
        // char but a wider one from unicode and we should reconstruct the exact original
        // document.  We could also have a map that stores the text offsets, and the box
        // (x, y, width, height) in the document where that text is found. This would be
        // AFTER applying the hyphen map.  This seems like I'm getting ahead of myself but
        // this is a major issue because without this data we can't jump to the place in
        // the document where the hit is indexed and I don't want an in-elegant solution
        // here.

        await PDFText.getText('../../packages/polar-bookshelf/docs/examples/pdf/bigtable.pdf', dumpTextContent, {maxPages: 1});

    });

    xit("Dump of Astronomy Content p293", async () => {

        const targetPage = 291

        await PDFText.getText('/Users/burton/astronomy.pdf', dumpTextContent, {
            skipPages: Numbers.range(1, targetPage),
            maxPages: targetPage + 2
        });

    });

    it("test merge words", () => {

        assertJSON(PDFTextWordMerger.doMergeWords(MERGE_DATA), [
            {
                "pageNum": 1,
                "x": 122.52,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 55.7493332,
                "str": "Bigtable:"
            },
            {
                "pageNum": 1,
                "x": 182.7095,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 83.8382788,
                "str": "A Distributed"
            },
            {
                "pageNum": 1,
                "x": 270.0279,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 46.98380499999999,
                "str": "Storage"
            },
            {
                "pageNum": 1,
                "x": 320.6118,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 43.885025799999994,
                "str": "System"
            },
            {
                "pageNum": 1,
                "x": 367.9769,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 17.9744528,
                "str": "for"
            }
        ]);

    });

    it('canMerge', () => {

        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[0], MERGE_DATA[1]));
        assert.isTrue( PDFTextWordMerger.canMerge(MERGE_DATA[1], MERGE_DATA[2]));
        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[2], MERGE_DATA[3]));
        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[3], MERGE_DATA[4]));

    });

});

const MERGE_DATA: ReadonlyArray<IPDFTextWord> = [
    {
        pageNum: 1,
        x: 122.52,
        y: 124.44000000000005,
        str: 'Bigtable:',
        width: 55.7493332,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 182.7095,
        y: 124.44000000000005,
        str: 'A Distrib',
        width: 56.853076599999994,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 239.3227,
        y: 124.44000000000005,
        str: 'uted',
        width: 26.9852022,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 270.0279,
        y: 124.44000000000005,
        str: 'Storage',
        width: 46.98380499999999,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 320.6118,
        y: 124.44000000000005,
        str: 'System',
        width: 43.885025799999994,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 367.9769,
        y: 124.44000000000005,
        str: 'for',
        width: 17.9744528,
        height: 14.3462,
    },

];
