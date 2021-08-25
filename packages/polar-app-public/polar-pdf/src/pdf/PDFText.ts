import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {PageViewport, TextContent, Transform, Util} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";
import {ISibling} from "polar-shared/src/util/Tuples";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace PDFText {

    import TextItem = _pdfjs.TextItem;
    import IPDFTextWord = PDFTextWordMerger.IPDFTextWord;

    export interface IPDFTextContent {
        readonly pageNum: number;
        readonly extract: ReadonlyArray<ReadonlyArray<IPDFTextWord>>;
        readonly viewport: PageViewport;
    }

    export interface IOpts {
        readonly initialPage?: number;
        readonly maxPages?: number;
    }

    export async function getText(docPathOrURL: PathOrURLStr,
                                  callback: (content: IPDFTextContent) => Promise<void>,
                                  opts: IOpts = {}) {

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        const numPages = Math.min(doc.numPages, opts.maxPages || Number.MAX_VALUE)

        const initialPage = opts.initialPage || 1;

        for (let pageNum = initialPage; pageNum < initialPage + numPages; pageNum++) {

            const page = await doc.getPage(pageNum);
            const viewport = page.getViewport({scale: 1.0});

            const textContent = await page.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false
            });

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
                    fontName: textItem.fontName
                };
            }

            const toTextIItemGroup = (item: IPDFTextWord): string => {
                const y = item.y;
                return `${y}:${item.height}`;
            }

            const textWords = textContent.items.map(toPDFTextWord);

            console.log("FIXME: textWords: ", JSON.stringify(textWords, null, "  "));

            const grouped = Arrays.groupBy(textWords, toTextIItemGroup);

            const extract = Object.values(grouped)
                .map(current => PDFTextWordMerger.doMergeWords(current));

            await callback({pageNum, extract, viewport});

        }

    }

}

export namespace PDFTextWordMerger {

    export interface IPDFTextWord {
        readonly pageNum: number;
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
        readonly str: string;
        readonly fontName: string;
    }

    export function canMerge(a: IPDFTextWord | undefined, b: IPDFTextWord | undefined): boolean {

        if (a === undefined ||  b === undefined) {
            return false;
        }

        if (a.height !== b.height) {
            // these are both a different height so they can't be merged
            return false;
        }

        const delta = a.height * 0.1;

        const cutoff = (a.x + a.width + delta);

        if (cutoff >= b.x) {
            return true;
        }

        return false;

    }

    export function doMergeWords(data: ReadonlyArray<IPDFTextWord>): ReadonlyArray<IPDFTextWord> {

        interface IPDFTextWordMerged extends IPDFTextWord {
            // merged to the previous word...
            readonly merged: boolean;
        }

        const toMerged = (a: IPDFTextWord | undefined, b: IPDFTextWord): IPDFTextWordMerged => {
            const merged = canMerge(a, b);
            return {...b, merged};
        }

        const createMergeGrouper = (): (tuple: ISibling<IPDFTextWordMerged>) => string => {

            let group: number = 0;

            return (tuple) => {


                if (tuple.prev) {

                    if (! tuple.curr.merged ||
                          tuple.prev.merged !== tuple.prev.merged) {

                        ++group;

                    }

                }

                return Numbers.toString(group);
            }

        }


        const doMerge = (mergedRecords: ReadonlyArray<IPDFTextWordMerged>): IPDFTextWord => {

            const width = Numbers.sum(...mergedRecords.map(current => current.width));

            const first = Arrays.first(mergedRecords)!;

            const str = mergedRecords.map(current => current.str).join("");

            return {
                pageNum: first.pageNum,
                x: first.x,
                y: first.y,
                height: first.height,
                width,
                str,
                fontName: first.fontName
            };

        }

        return arrayStream(data)
            .siblings()
            .map(current => toMerged(current.prev, current.curr))
            .siblings()
            .group(createMergeGrouper())
            .map(current => current.map(sibling => sibling.curr))
            .map(doMerge)
            .collect();

    }
}
