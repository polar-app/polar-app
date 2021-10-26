import {TextStr} from "polar-shared/src/util/Strings";
import {GCLSentenceSplitter} from "polar-google-cloud-language/src/GCLSentenceSplitter";

export namespace SentenceShingler {

    export interface ISentenceShingle {
        readonly text: string;
    }

    export function _computeShinglesFromSentences(sentences: ReadonlyArray<string>,
                                                  width = 4,
                                                  jump = 2): ReadonlyArray<ISentenceShingle> {

        const result: readonly ISentenceShingle[] = [];

        const pending = [...sentences];

        function emitSlice(slice: ReadonlyArray<string>) {

            const shingle: ISentenceShingle = {
                text: slice.join("  ")
            }

            result.push(shingle);

        }

        while (pending.length >= width) {

            const slice = pending.slice(0, width);

            emitSlice(slice);
            pending.splice(0, jump);

        }

        // if we have an impartial number of shingles at the end we need to emit
        // one final one that has an impartial overlap to verify that we don't
        // lose any data overlapping our shingles.
        if (pending.length > jump) {
            const end = sentences.length;
            const start = end - width
            const slice = sentences.slice(start, end);
            emitSlice(slice);
        }

        return result;

    }

    interface IComputeOpts {
        readonly filterCompleteSentences?: boolean;
    }

    export async function computeShinglesFromContent(content: TextStr, opts: IComputeOpts = {}) {

        const sentences = await GCLSentenceSplitter.split(content, opts);

        return _computeShinglesFromSentences(sentences);

    }

}
