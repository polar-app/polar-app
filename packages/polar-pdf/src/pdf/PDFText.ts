import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {PageViewport, Util} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";
import {ISibling} from "polar-shared/src/util/Tuples";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {Progress, ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace PDFText {

    import TextItem = _pdfjs.TextItem;
    import IPDFTextWord = PDFTextWordMerger.IPDFTextWord;

    export interface IPDFTextContent {
        readonly pageNum: PageNumber;
        readonly extract: ReadonlyArray<ReadonlyArray<IPDFTextWord>>;
        readonly viewport: PageViewport;
        readonly progress: Progress;
    }

    export interface IOpts {
        readonly maxPages?: PageNumber;

        readonly skipPages?: ReadonlyArray<PageNumber>
    }

    export async function getText(docPathOrURL: PathOrURLStr,
                                  callback: (content: IPDFTextContent) => Promise<void>,
                                  opts: IOpts = {}) {

        const skipPages = opts.skipPages || [];

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        const numPages = Math.min(doc.numPages, opts.maxPages || Number.MAX_VALUE)

        const progressTracker = new ProgressTracker({
            id: Hashcodes.create(docPathOrURL),
            total: numPages
        });

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {

            try {
                if (skipPages.includes(pageNum)) {
                    // skip this page and don't index any text.
                    console.log("Skipping page: " + pageNum);
                    continue;
                }

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
                    };
                }

                const toTextIItemGroup = (item: IPDFTextWord): string => {
                    const y = item.y;
                    return `${y}:${item.height}`;
                }

                const textWords = textContent.items.map(toPDFTextWord);
                const grouped = Arrays.groupBy(textWords, toTextIItemGroup);

                const extract = Object.values(grouped)
                    .map(current => PDFTextWordMerger.doMergeWords(current));

                // eslint-disable-next-line node/no-callback-literal
                await callback({
                    pageNum,
                    extract,
                    viewport,
                    progress: progressTracker.peek()
                });

            } finally {
                progressTracker.incr();
            }

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
                str
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
