import {TextStr} from "polar-shared/src/util/Strings";
import {ISibling, Tuples} from "polar-shared/src/util/Tuples";
import {GCLSentenceSplitter} from "polar-google-cloud-language/src/GCLSentenceSplitter";

export namespace SentenceShingler {

    export interface ISentenceShingle {
        readonly text: string;
    }

    function computeShinglesFromSentences(sentences: ReadonlyArray<string>,
                                          width = 4,
                                          jump = 2): ReadonlyArray<ISentenceShingle> {

        const result = [];

        for(let offset = 0; offset < sentences.length; offset = offset + jump) {
            const end = offset + width;
            const slice = sentences.slice(offset, end);

            if (slice.length === width) {

                const shingle: ISentenceShingle = {
                    text: slice.join("  ")
                }

                result.push(shingle);

            }

        }

        return result;

    }

    export async function computeShinglesFromContent(content: TextStr) {

        const sentences = await GCLSentenceSplitter.split(content);

        return computeShinglesFromSentences(sentences);

    }

}
