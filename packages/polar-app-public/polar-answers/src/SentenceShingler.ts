import {TextStr} from "polar-shared/src/util/Strings";
import {ISibling, Tuples} from "polar-shared/src/util/Tuples";
import {GCLSentenceSplitter} from "polar-google-cloud-language/src/GCLSentenceSplitter";

export namespace SentenceShingler {

    export interface ISentenceShingle {
        readonly idx: number;
        readonly text: string;
    }

    function computeShinglesFromSentences(sentences: ReadonlyArray<string>,
                                          width: number = 4,
                                          jump: number = 2): ReadonlyArray<ISentenceShingle> {

        const result = [];

        let idx = 0;
        for(let offset = 0; offset < sentences.length; offset = offset + jump) {
            const end = offset + width;
            const slice = sentences.slice(offset, end);
            result.push({
                idx: idx++,
                text: slice.join("  ")
            });

        }

        return result;

    }

    export async function computeShinglesFromContent(content: TextStr) {

        const sentences = await GCLSentenceSplitter.split(content);

        return computeShinglesFromSentences(sentences);

    }

}
