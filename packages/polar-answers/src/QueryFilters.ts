import {Stopwords} from "polar-shared/src/util/Stopwords";
import {GCLAnalyzeSyntax} from "polar-google-cloud-language/src/GCLAnalyzeSyntax";
import {FilterQuestionType} from "polar-answers-api/src/IAnswerExecutorRequest";
import {ESQueryStringQueryBuilder} from "./ESQueryStringQueryBuilder";

/**
 * Takes a text query and rewrites it using POS or other filters.
 */
export namespace QuestionFilters {

    import PartOfSpeechTag = GCLAnalyzeSyntax.PartOfSpeechTag;

    export type ESQueryStringQuery = string;

    export type QueryTermStr = string;

    export type TermJoiner = (terms: ReadonlyArray<QueryTermStr>) => ESQueryStringQuery;

    export type TermJoinerType = 'none' | 'AND';

    export function createJoiner(type: TermJoinerType): TermJoiner {
        switch (type) {

            case "none":
                return (terms) => terms.join(" ");

            case "AND":
                return (terms) => ESQueryStringQueryBuilder.buildAND(terms);

        }
    }

    export async function filter(question: string,
                                 filter: FilterQuestionType,
                                 termJoiner: TermJoiner): Promise<ESQueryStringQuery> {

        function filterUsingStopwords() {
            const words = question.split(/[ \t]+/);
            const stopwords = Stopwords.words('en');
            return termJoiner(Stopwords.removeStopwords(words, stopwords));
        }

        async function filterUsingPoS(pos: ReadonlyArray<PartOfSpeechTag>) {
            const analysis = await GCLAnalyzeSyntax.extractPOS(question, pos);
            return termJoiner(analysis.map(current => current.content));
        }

        // eslint-disable-next-line camelcase
        switch (filter) {

            case "stopwords":
                return filterUsingStopwords();

            case "part-of-speech-noun":
                return await filterUsingPoS(['NOUN']);

            case "part-of-speech":
            case "part-of-speech-noun-adj":
                return await filterUsingPoS(['NOUN', 'ADJ']);

            case "none":
                return question;

        }

    }

}
