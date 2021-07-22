import {PDFText, PDFTextWordMerger} from "./PDFText";
import {Util} from "pdfjs-dist";
import {Arrays} from "polar-shared/src/util/Arrays";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";
import IPDFTextContent = PDFText.IPDFTextContent;
import TextItem = _pdfjs.TextItem;
import IPDFTextItem = PDFText.IPDFTextItem;
import {assert} from 'chai';

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

            function toTextItem(textItem: TextItem): IPDFTextItem {
                const tx = Util.transform(viewport.transform, textItem.transform);
                return {
                    pageNum,
                    tx,
                    ...textItem
                };
            }

            const toTextIItemGroup = (item: IPDFTextItem): string => {
                const y = item.tx[5];
                return `${y}:${item.height}`;
            }

            const grouped = Arrays.groupBy(pdfTextContent.textContent.items.map(toTextItem), toTextIItemGroup);

            // TODO: we have to merge adjacent terms that overlap on the x-axis
            // and in this example we have:
            //
            // Bigtable:,A Distrib,uted,Storage,System,for,Structur,ed,Data
            //
            // and some of these words are the same.

            function doDebug<T>(value: T): T {
                console.log(value);
                return value;
            }

            const lines = Object.values(grouped)
                .map(current => current.map(item => item.str))
                .map(current => current.join(" "));

            console.log("lines: ", lines)

            // for(const item of textContent.items) {
            //
            //     // https://github.com/mozilla/pdf.js/issues/5643
            //
            //     const tx = Util.transform(viewport.transform, item.transform);
            //
            //     console.log(item.str);
            //
            //     // TODO: after transform I think the last two params , x and y, are height.
            //
            //     console.log('  tx: ', tx);
            //     console.log('  pageNum: ', pageNum);
            //     console.log('  dir: ', item.dir);
            //     console.log('  fontName: ', item.fontName);
            //     console.log('  transform: ', item.transform);
            //     console.log('  height: ', item.height);
            //
            // }

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
            },
            {
                "pageNum": 1,
                "x": 389.55134000000004,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 66.6811376,
                "str": "Structured"
            },
            {
                "pageNum": 1,
                "x": 459.7126400000001,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 29.481441,
                "str": "Data"
            }
        ]);

    });

    it('canMerge', () => {

        assert.isFalse(PDFTextWordMerger.canMerge(PDFTextWordMerger.toWord(MERGE_DATA[0]), PDFTextWordMerger.toWord(MERGE_DATA[1])))
        assert.isTrue( PDFTextWordMerger.canMerge(PDFTextWordMerger.toWord(MERGE_DATA[1]), PDFTextWordMerger.toWord(MERGE_DATA[2])))
        assert.isFalse(PDFTextWordMerger.canMerge(PDFTextWordMerger.toWord(MERGE_DATA[2]), PDFTextWordMerger.toWord(MERGE_DATA[3])))
        assert.isFalse(PDFTextWordMerger.canMerge(PDFTextWordMerger.toWord(MERGE_DATA[3]), PDFTextWordMerger.toWord(MERGE_DATA[4])))

    });

});

const MERGE_DATA: ReadonlyArray<IPDFTextItem> = [
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 122.52, 124.44000000000005 ],
        str: 'Bigtable:',
        dir: 'ltr',
        width: 55.7493332,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 122.52, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 182.7095, 124.44000000000005 ],
        str: 'A Distrib',
        dir: 'ltr',
        width: 56.853076599999994,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 182.7095, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 239.3227, 124.44000000000005 ],
        str: 'uted',
        dir: 'ltr',
        width: 26.9852022,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 239.3227, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 270.0279, 124.44000000000005 ],
        str: 'Storage',
        dir: 'ltr',
        width: 46.98380499999999,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 270.0279, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 320.6118, 124.44000000000005 ],
        str: 'System',
        dir: 'ltr',
        width: 43.885025799999994,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 320.6118, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 367.9769, 124.44000000000005 ],
        str: 'for',
        dir: 'ltr',
        width: 17.9744528,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 367.9769, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 389.55134000000004, 124.44000000000005 ],
        str: 'Structur',
        dir: 'ltr',
        width: 52.4066686,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 389.55134000000004, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 441.71814000000006, 124.44000000000005 ],
        str: 'ed',
        dir: 'ltr',
        width: 14.274469,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 441.71814000000006, 667.56 ],
        fontName: 'g_d0_f1'
    },
    {
        pageNum: 1,
        tx: [ 14.3462, 0, 0, -14.3462, 459.7126400000001, 124.44000000000005 ],
        str: 'Data',
        dir: 'ltr',
        width: 29.481441,
        height: 14.3462,
        transform: [ 14.3462, 0, 0, 14.3462, 459.7126400000001, 667.56 ],
        fontName: 'g_d0_f1'
    }
];
