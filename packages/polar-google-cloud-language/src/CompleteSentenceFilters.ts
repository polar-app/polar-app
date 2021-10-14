import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {Arrays} from "polar-shared/src/util/Arrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Numbers} from "polar-shared/src/util/Numbers";

export namespace CompleteSentenceFilters {

    export type POSTag = 'NOUN' | 'VERB' | 'ADJ' | 'PUNCT' | 'ADP' | 'CONJ';

    export interface IPartOfSpeech {
        readonly tag?: POSTag | null | any;
    }

    export interface IText {
        readonly content?: string | null | undefined;
        readonly beginOffset?: number | null | undefined;
    }

    export interface IToken {
        readonly text?: IText | null | undefined;
        readonly partOfSpeech?: IPartOfSpeech | null;
    }

    export interface ISentence {
        readonly text?: IText | null;
    }

    export interface ISentenceWithTokens extends ISentence {
        readonly tokens: ReadonlyArray<IToken>;
    }

    export interface IAnalyzedSyntax {
        readonly sentences: ReadonlyArray<ISentence> | null | undefined;
        readonly tokens: ReadonlyArray<IToken>;
    }

    export interface ISentencePointer {
        readonly sentence: number;
        readonly start: number;
    }

    export function _computeSentencePointers(sentences: ReadonlyArray<ISentence>): ReadonlyArray<ISentencePointer> {

        return sentences.map((current, idx): ISentencePointer => ({
            sentence: idx,
            start: current.text?.beginOffset || 0
        }));

    }

    export function _computeIDSentenceForToken(sentencePointers: ReadonlyArray<ISentencePointer>, token: IToken): number {

        const sentenceOffset =
            arrayStream(sentencePointers)
                .filter(current => current.start <= (token?.text?.beginOffset || 0))
                .last()

        if (! sentenceOffset) {
            throw new Error(`No sentence in index for token at: ${token?.text?.beginOffset}: ` + JSON.stringify(sentencePointers));
        }

        return sentenceOffset.sentence;

    }

    // build an index of the sentences and all their tokens.
    export function _createSentenceTokenMultiset(sentencePointers: ReadonlyArray<ISentencePointer>, tokens: ReadonlyArray<IToken>) {

        const multiset = new ArrayListMultimap<number, IToken>();

        tokens.forEach(current => {
            const sent = _computeIDSentenceForToken(sentencePointers, current);
            multiset.put(sent, current);
        })

        return multiset;

    }

    export function _computeSentencesWithTokens(sentences: ReadonlyArray<ISentence>,
                                                sentencePointers: ReadonlyArray<ISentencePointer>,
                                                tokens: ReadonlyArray<IToken>): ReadonlyArray<ISentenceWithTokens> {

        const sentenceTokenMultiset = _createSentenceTokenMultiset(sentencePointers, tokens);

        return arrayStream(Numbers.range(0, sentences.length - 1))
            .map((idx): ISentenceWithTokens => {
                const sentence = sentences[idx];
                const tokens = sentenceTokenMultiset.get(idx);
                return {...sentence, tokens}
            })
            .collect()

    }

    export function filter(syntax: IAnalyzedSyntax): ReadonlyArray<ISentence> {

        const sentences = syntax.sentences || [];

        const sentencePointers = _computeSentencePointers(sentences)

        // compute each sentence and their tokens to see if it's complete
        const sentencesWithTokens = _computeSentencesWithTokens(sentences, sentencePointers, syntax.tokens);

        // now return only complete sentences...
        return arrayStream(sentencesWithTokens)
            .filter((current, idx) => {
                const lastSentence = idx === sentences.length - 1;
                return isCompleteSentence(current.tokens, lastSentence);
            })
            .map((current): Required<ISentence> => {
                return {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    text: current.text!
                }
            })
            .collect()

    }


    /**
     * A complete sentence contains at least one subject, one predicate, one
     * object, and closes with punctuation. Subject and object are almost
     * always nouns, and the predicate is always a verb.
     *
     * Thus you need to check if your sentence contains two nouns, one verb
     * and closes with punctuation:
     */
    export function isCompleteSentence(sentenceTokens: ReadonlyArray<IToken>, lastSentence = false) {

        if (sentenceTokens.length < 3) {
            // obviously isn't a complete sentence as we need at least three
            // tokens (two nouns, one verb)
            return false;
        }

        const multimap = new ArrayListMultimap<POSTag, IToken>();

        sentenceTokens.forEach(current => multimap.put(current.partOfSpeech?.tag || 'UNKNOWN', current));

        if (multimap.get('NOUN').length < 2) {
            return false;
        }

        if (multimap.get('VERB').length < 1) {
            return false;
        }

        if (! lastSentence) {

            const lastTokenInSentence = Arrays.last(sentenceTokens);

            if (lastTokenInSentence?.partOfSpeech?.tag !== 'PUNCT') {
                return false;
            }
        }

        return true;

    }

}
