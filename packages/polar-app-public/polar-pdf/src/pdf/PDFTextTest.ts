import {PDFText} from "./PDFText";
import {PageViewport, TextContent, Transform, Util} from "pdfjs-dist";
import IPDFTextContent = PDFText.IPDFTextContent;
import TextItem = _pdfjs.TextItem;
import {Arrays} from "polar-shared/src/util/Arrays";

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

xdescribe('PDFText', function() {

    it("basic read", async function () {

        interface IPDFTextItem extends TextItem {
            readonly pageNum: number;
            readonly tx: Transform;
        }

        const dumpTextContent = (pdfTextContent: IPDFTextContent) => {

            const {textContent, viewport, pageNum} = pdfTextContent;

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

            const lines = Object.values(grouped)
                .map(current => current.map(item => item.str))
                .map(current => current.join(" "));

            console.log("FIXME:", lines.join("\n"))

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

});
