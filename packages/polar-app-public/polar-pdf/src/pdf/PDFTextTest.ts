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

            const {viewport, pageNum} = pdfTextContent;

            function toPDFTextWord(textItem: TextItem): IPDFTextWord {
                const tx = Util.transform(viewport.transform, textItem.transform);
                const x = tx[4];
                const y = tx[5];
                return {
                    pageNum,
                    x, y,
                    width: textItem.width,
                    height: textItem.height,
                    str: textItem.str,
                };
            }

            const toTextIItemGroup = (item: IPDFTextWord): string => {
                const y = item.y;
                return `${y}:${item.height}`;
            }

            const textWords = pdfTextContent.textContent.items.map(toPDFTextWord);

            const grouped = Arrays.groupBy(textWords, toTextIItemGroup);

            // const merged = PDFTextWordMerger.doMergeWords(textItems);

            // FIXME: rework this
            const lines = Object.values(grouped)
                .map(current => PDFTextWordMerger.doMergeWords(current).map(item => item.str).join(" "))
                .join("\n")


            console.log("lines: \n", lines)

        };

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
