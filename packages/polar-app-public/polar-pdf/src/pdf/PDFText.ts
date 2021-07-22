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

    export interface IPDFTextItem extends TextItem {
        readonly pageNum: number;
        readonly tx: Transform;
    }

    export interface IPDFTextContent {
        readonly pageNum: number;
        readonly textContent: TextContent;
        readonly viewport: PageViewport;
    }

    export interface IOpts {
        readonly maxPages?: number;
    }

    export async function getText(docPathOrURL: PathOrURLStr,
                                  callback: (content: IPDFTextContent) => void,
                                  opts: IOpts = {}) {

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        const numPages = Math.min(doc.numPages, opts.maxPages || Number.MAX_VALUE)

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {

            const page = await doc.getPage(pageNum);
            const viewport = page.getViewport({scale: 1.0});

            const textContent = await page.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false
            });

            callback({pageNum, textContent, viewport});

        }

    }

}

export namespace PDFTextWordMerger {

    import IPDFTextItem = PDFText.IPDFTextItem;

    interface IPDFTextWord {
        readonly pageNum: number;
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
        readonly str: string;
    }

    export function toWord(item: IPDFTextItem): IPDFTextWord {
        const x = item.tx[4];
        const y = item.tx[5];

        return {
            pageNum: item.pageNum,
            x, y,
            width: item.width,
            height: item.height,
            str: item.str
        }
    }

    export function canMerge(a: IPDFTextWord | undefined, b: IPDFTextWord | undefined): boolean {

        if (a === undefined ||  b === undefined) {
            return false;
        }

        if (a.height !== b.height) {
            // these are both a different height so they can't be merged
            return false;
        }

        const delta = a.height * 0.0;

        const cutoff = (a.x + a.width + delta);

        if (cutoff >= b.x) {
            return true;
        }

        return false;

    }

    export function doMergeWords(data: ReadonlyArray<IPDFTextItem>): ReadonlyArray<IPDFTextWord> {

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
                str
            };

        }

        return arrayStream(data)
            .map(toWord)
            .siblings()
            .map(current => toMerged(current.prev, current.curr))
            .siblings()
            .group(createMergeGrouper())
            .map(current => current.map(sibling => sibling.curr))
            .map(doMerge)
            .collect();

    }
}
