import {GCLSentenceSplitter} from "polar-google-cloud-language/src/GCLSentenceSplitter";
import {Tuples} from "polar-shared/src/util/Tuples";

/**
 * Sometimes OpenAI, with lower cost models, can generate both truncated and
 * redundant completions.
 *
 * This is a computationally *fast* solution to that problem where we use
 * sentence boundary detection to find redundant sentences and potentially
 * remove a trailing/incomplete sentence.
 *
 * Example:
 *
 *
 * Q: Compare Mars with Mercury and the Moon in terms of overall properties.
 * What are the similarities and differences?
 *
 *
 * A: Mars is the most distant planet from the Sun.  It is also the smallest
 * planet in the solar system.  It is the only planet that has a retrograde
 * orbit.  It is the only planet that has a retrograde orbit.  It is the only
 * planet that has a retrograde orbit.  It is the only planet that has a
 * retrograde orbit. It is the only planet that has a retrograde orbit.  It is
 * the only planet that has a retrograde orbit.  It is the only planet that has
 * a retrograde orbit.  It is the only planet that has a retrograde orbit
 *
 */
export namespace OpenAICompletionCleanup {

    export interface ISentenceRemoval {
        readonly idx: number;
        readonly sentence: string;
    }

    export interface IOpenAICompletionCleanup {

        /**
         * True if the text was modified.
         */
        readonly modified: boolean;

        readonly text: string;
    }

    /**
     *
     * @param text
     */
    export async function clean(text: string): Promise<IOpenAICompletionCleanup> {

        const sentences = await GCLSentenceSplitter.split(text);

        // the sentences that have been emitted so that we don't do any duplicate emits.
        const emitted: { [sentence: string]: boolean } = {};

        let modified = false;

        // the sentences we want to emit.
        const emits: string[] = [];

        for(const sentence of Tuples.createSiblings(sentences)) {

            if (emitted[sentence.curr]) {
                modified = true;
                continue;
            }

            if (sentences.length > 1 && sentence.next === undefined) {

                function terminatedSentence(text: string) {
                    return text.endsWith("?") || text.endsWith(".") || text.endsWith("!");
                }

                if (! terminatedSentence(sentence.curr)) {
                    modified = true;
                    continue;
                }

            }

            emitted[sentence.curr] = true;
            emits.push(sentence.curr)

        }

        if (modified) {

            return {
                modified: true,
                text: emits.join(" ")
            }

        } else {
            return {
                modified: false,
                text
            }
        }

    }

}
