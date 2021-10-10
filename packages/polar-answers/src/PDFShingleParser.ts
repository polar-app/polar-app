import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";

/**
 * Parse a PDF into shingles and trigger a callback for each batch.
 */
export namespace PDFShingleParser {

    import IPDFTextContent = PDFText.IPDFTextContent;

    export interface IParseOpts {
        readonly url: URLStr;
        readonly skipPages?: ReadonlyArray<PageNumber>;
        readonly maxPages?: number;
    }

    export interface IOnShinglesEvent {
        readonly content: string;
        readonly shingles: ReadonlyArray<SentenceShingler.ISentenceShingle>;
        readonly pageNum: number;
    }

    export type OnShinglesCallback = (event: IOnShinglesEvent) => Promise<void>;

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

        const pdfTextCallback = async (pdfTextContent: IPDFTextContent) => {

            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            const shingles = await SentenceShingler.computeShinglesFromContent(content);

            // eslint-disable-next-line node/no-callback-literal
            await callback({
                content,
                pageNum,
                shingles
            });

        }

        await PDFText.getText(opts.url, pdfTextCallback, {
            skipPages: opts.skipPages,
            maxPages: opts.maxPages
        });

    }
}
