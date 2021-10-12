import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {Progress, ProgressTracker} from "polar-shared/src/util/ProgressTracker";

/**
 * Parse a PDF into shingles and trigger a callback for each batch.
 */
export namespace PDFShingleParser {

    import IPDFTextContent = PDFText.IPDFTextContent;

    export interface IParseOpts {
        readonly url: URLStr;
        readonly skipPages?: ReadonlyArray<PageNumber>;
        readonly maxPages?: number;
        readonly filterCompleteSentences?: boolean;
    }

    export interface IOnShinglesEvent {
        readonly content: string;
        readonly shingles: ReadonlyArray<SentenceShingler.ISentenceShingle>;
        readonly pageNum: number;
        readonly progress: Progress;
    }

    export type OnShinglesCallback = (event: IOnShinglesEvent) => Promise<void>;

    // a 2000 page PDF is about 25MB of text... if we did a contact of it ALL
    // together it wouldn't be that difficult to index but would require more
    // memory in the indexer.  About 4x this size 100MB and still FAR less than
    // the 250MB required for even the minimal google cloud functions and we're
    // allocating 2GB.  It's ALSO possible for us to still stream parse it if
    // we want.


    export async function parse(opts: IParseOpts, callback: OnShinglesCallback) {

        // TODO major bug / feature error here.  Text across pages isn't
        // assembled properly.  We're also not really able to tell if the text
        // on the next page is the continuation of the text on the current page.

        // TODO: one solution would be to just concat all the text together and
        // parse everything in memory or stream it but we have to break the
        // pages up into blocks properly and we would also need to have SOME way
        // to highlight text that is across pages.

        // TODO: maybe one solution here would be to index/emit JUST blocks and
        // then there would only be a special case across page boundaries.

        // TODO the page sep would be a space since the PDFs are probably using
        // word breaks to join across pages but I imagine they could also be
        // hyphens but first things first.

        // TODO: if we're going to join across multiple pages then I need a way
        // to keep track of the pageNum since they're going to change.

        // TODO: I also need tests for multi-column layouts to make sure those
        // are extracted properly too.

        // TODO: I think we NEED to extract by blocks/paragraphs though because
        // if we don't then I CAN NOT send that much data at once to GCL or it
        // will choke but the question is where do we terminate the parse?
        //
        // TODO: maybe the parser just emits a new type of record which is a
        // 'break' not a string which is when the next section is greater than
        // the height of the current font.

        const pdfTextCallback = async (pdfTextContent: IPDFTextContent) => {

            const {extract, pageNum, progress} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            const shingles = await SentenceShingler.computeShinglesFromContent(content, {filterCompleteSentences: opts.filterCompleteSentences});

            // eslint-disable-next-line node/no-callback-literal
            await callback({
                content,
                pageNum,
                shingles,
                progress
            });

        }

        await PDFText.getText(opts.url, pdfTextCallback, {
            skipPages: opts.skipPages,
            maxPages: opts.maxPages
        });

    }
}
