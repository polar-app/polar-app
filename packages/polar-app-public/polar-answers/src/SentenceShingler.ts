import {SentenceSplitter} from "./SentenceSplitter";
import {TextStr} from "polar-shared/src/util/Strings";
import {ISibling, Tuples} from "polar-shared/src/util/Tuples";

export namespace SentenceShingler {

    export interface ISentenceShingle {
        readonly idx: number;
        readonly text: string;
    }

    function computeShinglesFromSentences(sentences: ReadonlyArray<string>): ReadonlyArray<ISentenceShingle> {

        const tuples = Tuples.createSiblings(sentences);

        const toShingle = (sibling: ISibling<string>, idx: number): ISentenceShingle => {
            const text = (sibling.prev !== undefined ? (sibling.prev + " ") : "") +
                sibling.curr +
                (sibling.next !== undefined ? (sibling.next + " ") : "");

            return {
                idx,
                text
            };

        }

        return tuples.map((current, idx) => toShingle(current, idx));

    }

    export async function computeShinglesFromContent(content: TextStr) {

        const sentences = await SentenceSplitter.split(content);

        console.log("Found N sentences: " + sentences.length);

        return computeShinglesFromSentences(sentences);

    }

}
