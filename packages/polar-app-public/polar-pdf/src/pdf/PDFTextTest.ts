import {PDFText, PDFTextWordMerger} from "./PDFText";
import {Util} from "pdfjs-dist";
import {Arrays} from "polar-shared/src/util/Arrays";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";
import IPDFTextContent = PDFText.IPDFTextContent;
import TextItem = _pdfjs.TextItem;
import IPDFTextItem = PDFText.IPDFTextItem;
import {assert} from 'chai';
import IPDFTextWord = PDFTextWordMerger.IPDFTextWord;

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

    it("basic read", async function () {

        const dumpTextContent = (pdfTextContent: IPDFTextContent) => {
            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            console.log("pageNum: ", pageNum);
            console.log("content: \n", content)

        };

        // FIXME: still missing characters like:

        // tion 6 describes some of the re nements that we made
        //   - this might be a unicode char ?
        //
        // - we need a lang categorizer
        //    - use nlp.js for this... but use it in another package so that this code can ALSO be used
        //      in the front end.  Technically this code should post-process the content into a
        //      higher level structure
        //
        // - we need to join words with hyphens into their original text... but
        //   maybe also keep the hyphenated text too.
        //
        //

        await PDFText.getText('/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/bigtable.pdf', dumpTextContent, {maxPages: 1});

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
