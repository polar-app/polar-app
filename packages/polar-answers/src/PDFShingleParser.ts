import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";

/**
 * Parse a PDF into shingles and trigger a callback for each batch.
 */
export namespace PDFShingleParser {

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

        await PDFText.getText(opts.url, async pdfTextContent => {

                const {extract, pageNum} = pdfTextContent;

                const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

                const shingles = await SentenceShingler.computeShinglesFromContent(content);

                // eslint-disable-next-line node/no-callback-literal
                await callback({
                    content,
                    pageNum,
                    shingles
                });

            },
            {
                skipPages: opts.skipPages,
                maxPages: opts.maxPages
            });

    }
}
