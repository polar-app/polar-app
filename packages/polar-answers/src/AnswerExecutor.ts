import {ESRequests} from "./ESRequests";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {UserIDStr} from "polar-shared/src/util/Strings";
import {FilterQuestionType, IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {
    IAnswerExecutorError,
    IAnswerExecutorResponse,
    IAnswerExecutorTimings,
    ISelectedDocumentWithRecord
} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ISelectedDocument} from "polar-answers-api/src/ISelectedDocument";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {OpenAISearchReRanker} from "./OpenAISearchReRanker";
import {Stopwords} from "polar-shared/src/util/Stopwords";
import {IOpenAIAnswersRequest, QuestionAnswerPair} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {IElasticsearchQuery} from "polar-answers-api/src/IElasticsearchQuery";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IAnswerExecutorTraceMinimal} from "polar-answers-api/src/IAnswerExecutorTrace";
import {AnswerExecutorTraceCollection} from "polar-firebase/src/firebase/om/AnswerExecutorTraceCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AnswerExecutorTracer} from "./AnswerExecutorTracer";
import {GCLAnalyzeSyntax} from "polar-google-cloud-language/src/GCLAnalyzeSyntax";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

const DEFAULT_DOCUMENTS_LIMIT = 200;
const DEFAULT_FILTER_QUESTION: FilterQuestionType = 'part-of-speech';

export namespace AnswerExecutor {

    import IElasticSearchResponse = ESRequests.IElasticSearchResponse;
    import PartOfSpeechTag = GCLAnalyzeSyntax.PartOfSpeechTag;

    export interface IAnswerExecutorRequestWithUID extends IAnswerExecutorRequest {
        readonly uid: UserIDStr;
    }

    export const EXAMPLES_CONTEXT: string =
        [
            "In 2017, U.S. life expectancy was 78.6 years.",
            'Google Analytics is a service that helps webmasters analyze traffic patterns at their web sites.  It provides aggregate statistics, such as the number of unique visitors per day and the page views per URL per day, as well as site-tracking reports, such as the percentage of users that made a purchase, given that they earlier viewed a specific page.  To enable the service, webmasters embed a small JavaScript program in their web pages. '
        ].join("  ");

    const NO_ANSWER_CODE = '__UNKNOWN__'

    // TODO: add stop words...

    export const EXAMPLES: ReadonlyArray<QuestionAnswerPair> = [
        ["What is human life expectancy in the United States?", "78 years."],
        ["What is Google Analytics", "Google Analytics is a service that helps webmasters analyze patterns at their web sites."],
        ["What does Google Analytics provide?", "It provides aggregate statistics, such as the number of unique visitors per day and the page views per URL per day."],
        ["Who is the President of Xexptronica", NO_ANSWER_CODE],
        ["What do dinosaurs capilate?", NO_ANSWER_CODE],
        ["Is foo a bar?", NO_ANSWER_CODE],
    ];

    export const STOP = ["\n", "<|endoftext|>"];

    export const MAX_TOKENS = 250;

    export const SEARCH_MODEL = 'ada';

    export const MODEL = 'ada';

    export const TEMPERATURE = 0;

    export const RETURN_METADATA = true;

    export const N = 1;

    export interface ResultWithDuration<V> {
        readonly value: V;
        readonly duration: number;
    }

    export type ResultWithDurationTuple<V> = [V, number];

    export async function executeWithDuration<V>(delegate: (() => Promise<V>) | Promise<V>): Promise<ResultWithDurationTuple<V>> {

        const before = Date.now();

        const value =
            typeof delegate === 'function' ?
                await delegate() :
                await delegate;

        const after = Date.now();

        const duration = after - before;

        return [value, duration];

    }

    export async function exec(request: IAnswerExecutorRequestWithUID): Promise<IAnswerExecutorResponse | IAnswerExecutorError> {

        const {question, uid} = request;

        interface ESDocumentResultsBase {

            // eslint-disable-next-line camelcase
            readonly elasticsearch_query: IElasticsearchQuery;

            // eslint-disable-next-line camelcase
            readonly elasticsearch_records: ReadonlyArray<IAnswerDigestRecord>;

            // eslint-disable-next-line camelcase
            readonly elasticsearch_duration: number;

            // eslint-disable-next-line camelcase
            readonly elasticsearch_indexes: ReadonlyArray<string>;

            // eslint-disable-next-line camelcase
            readonly elasticsearch_url: string;

            // eslint-disable-next-line camelcase
            readonly elasticsearch_hits: number;

            /**
             * The resulting records.
             */
            readonly records: ReadonlyArray<IAnswerDigestRecord>;

        }

        interface ESDocumentResultsWithoutRerank extends ESDocumentResultsBase {
            // eslint-disable-next-line camelcase
            readonly openai_reranked_records: undefined;

            // eslint-disable-next-line camelcase
            readonly openai_reranked_duration: undefined;

        }

        interface ESDocumentResultsWithRerank extends ESDocumentResultsBase {

            // eslint-disable-next-line camelcase
            readonly openai_reranked_records: ReadonlyArray<IAnswerDigestRecord>;

            // eslint-disable-next-line camelcase
            readonly openai_reranked_duration: number;

        }

        type ESDocumentResults = ESDocumentResultsWithoutRerank | ESDocumentResultsWithRerank;

        // TODO: trace ALL opts given...

        async function computeDocuments() {
            return computeDocumentsFromES();
        }

        async function computeDocumentsFromES(): Promise<ESDocumentResults> {

            // TODO make this into a generic search client and don't hard code the ES query here.

            // TODO: trace the index used
            // run this query on the digest ...
            const index = ESAnswersIndexNames.createForUserDocs(uid);

            // eslint-disable-next-line camelcase
            const documents_limit = request.documents_limit || DEFAULT_DOCUMENTS_LIMIT;

            // TODO this has to be hard coded and we only submit docs that would be
            // applicable to the answer API and we would need a way to easily
            // calculate the short head of the result set.  The OpenAI Answers API
            // only allows 200 documents so we might just want to hard code this.

            // eslint-disable-next-line camelcase
            const size = request.rerank_elasticsearch ? (request.rerank_elasticsearch_size || 10000) : documents_limit;

            console.log("Running search with size: " + size);

            async function computeQueryTextFromQuestion() {

                // eslint-disable-next-line camelcase
                const filter_question = request.filter_question || DEFAULT_FILTER_QUESTION;

                function filterUsingStopwords() {
                    const words = request.question.split(/[ \t]+/);
                    const stopwords = Stopwords.words('en');
                    return Stopwords.removeStopwords(words, stopwords).join(" ");
                }

                async function filterUsingPoS(pos: ReadonlyArray<PartOfSpeechTag>) {
                    const analysis = await GCLAnalyzeSyntax.extractPOS(request.question, pos);
                    return analysis.map(current => current.content).join(" ");
                }

                // eslint-disable-next-line camelcase
                switch (filter_question) {

                    case "stopwords":
                        return filterUsingStopwords();

                    case "part-of-speech-noun":
                        return await filterUsingPoS(['NOUN']);

                    case "part-of-speech":
                    case "part-of-speech-noun-adj":
                        return await filterUsingPoS(['NOUN', 'ADJ']);

                    case "none":
                        return request.question;

                }

            }

            const queryText = await computeQueryTextFromQuestion();

            // TODO: trace the query
            // eslint-disable-next-line camelcase
            const elasticsearch_query: IElasticsearchQuery = {
                "query": {
                    "query_string": {
                        "query": queryText,
                        "default_field": "text"
                    }
                },
                size
            };

            // TODO: trace the requestURL
            // eslint-disable-next-line camelcase
            const elasticsearch_url = `/${index}*/_search?allow_no_indices=true`;

            // TODO: trace the esResponse
            // eslint-disable-next-line camelcase
            const [esResponse, elasticsearch_duration]
                = await executeWithDuration<IElasticSearchResponse<IAnswerDigestRecord>>(ESRequests.doPost(elasticsearch_url, elasticsearch_query));

            // eslint-disable-next-line camelcase
            const elasticsearch_records = esResponse.hits.hits.map(current => current._source);

            // TODO: do this in the indexer, not the executor? this way we can
            // same some CPU time during execution.

            if (request.rerank_elasticsearch) {

                console.log("Re-ranking N ES results via OpenAI: " + elasticsearch_records.length)

                // TODO: trace the latency of the rerank too..

                // TODO: trace the ranked
                // eslint-disable-next-line camelcase
                const [openai_reranked_records_with_score, openai_reranked_duration] =
                    await executeWithDuration(OpenAISearchReRanker.exec(request.rerank_elasticsearch_model || 'ada',
                        request.question,
                        elasticsearch_records,
                        hit => hit.text));

                // eslint-disable-next-line camelcase
                const openai_reranked_records = arrayStream(openai_reranked_records_with_score)
                    .map(current => current.record)
                    .collect();

                // eslint-disable-next-line camelcase
                const records = arrayStream(openai_reranked_records)
                    .head(documents_limit)
                    .collect();

                return <ESDocumentResultsWithRerank>{
                    elasticsearch_query,
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_hits: elasticsearch_records.length,
                    elasticsearch_indexes: [index],
                    elasticsearch_url,
                    openai_reranked_records,
                    openai_reranked_duration,
                    records
                };

            } else {

                const records = arrayStream(elasticsearch_records)
                    .head(documents_limit)
                    .collect();

                // eslint-disable-next-line camelcase
                return <ESDocumentResultsWithoutRerank>{
                    elasticsearch_query,
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_hits: elasticsearch_records.length,
                    elasticsearch_indexes: [index],
                    elasticsearch_url,
                    openai_reranked_records: undefined,
                    openai_reranked_duration: undefined,
                    records
                };

            }

        }

        const computedDocuments = await computeDocuments();
        const {records} = computedDocuments;

        const documents = records.map(current => current.text.replace(/\n/g, ' '));

        // TODO how do we compute documents which have no known answer?

        // Assuming your temperature is already at 0 (making the API less likely
        // to confabulate), you can show the API how to say "Unknown" using
        // examples and examples_context. For instance, one example could be
        // "Who invented Cottage Cheese?", "Unknown" Another example could be
        // "When was the first Olympics?", "Unknown" Of course, you'll want
        // examples that are answered by the examples_context as well. Does this
        // make sense?

        // eslint-disable-next-line camelcase
        const search_model = request.search_model || SEARCH_MODEL;
        const model = request.model || MODEL;

        // TODO: trace this...
        // eslint-disable-next-line camelcase
        const openai_answers_request: IOpenAIAnswersRequest = {
            search_model,
            model,
            question,
            examples_context: EXAMPLES_CONTEXT,
            examples: EXAMPLES,
            max_tokens: MAX_TOKENS,
            stop: STOP,
            documents,
            n: N,
            temperature: TEMPERATURE,
            return_metadata: RETURN_METADATA,
            // logprobs: 10,
        }

        // TODO: trace this.
        // eslint-disable-next-line camelcase
        const [openai_answers_response, openai_answer_duration] = await executeWithDuration(OpenAIAnswersClient.exec(openai_answers_request));

        const primaryAnswer = Arrays.first(openai_answers_response.answers);

        if (primaryAnswer === NO_ANSWER_CODE) {

            return {
                error: true,
                code: 'no-answer'
            }

        }

        function convertToSelectedDocumentWithRecord(doc: ISelectedDocument): ISelectedDocumentWithRecord<IAnswerDigestRecord> {
            return {
                document: doc.document,
                text: doc.text,
                object: doc.object,
                score: doc.score,
                record: records[doc.document]
            }
        }

        const id = Hashcodes.createRandomID();

        const timings: IAnswerExecutorTimings = {
            elasticsearch: computedDocuments.elasticsearch_duration,
            openai_rerank: computedDocuments.openai_reranked_duration,
            openai_answer: openai_answer_duration
        }

        async function doTrace() {

            const firestore = FirestoreAdmin.getInstance();

            // One token is roughly 4 characters as per OpenAI docs
            const openAiTokens = question.length / 4;
            const costEstimated = openAiTokens * getPricePerToken(model);

            const trace: IAnswerExecutorTraceMinimal = {
                id,
                created: ISODateTimeStrings.create(),
                type: 'trace-minimal',
                ...request,
                elasticsearch_query: computedDocuments.elasticsearch_query,
                elasticsearch_url: computedDocuments.elasticsearch_url,
                elasticsearch_indexes: computedDocuments.elasticsearch_indexes,
                elasticsearch_hits: computedDocuments.elasticsearch_hits,
                openai_answers_request: openai_answers_request,
                openai_answers_response: openai_answers_response,
                docIDs: AnswerExecutorTracer.computeUniqueDocIDs(computedDocuments.elasticsearch_records),
                timings,
                vote: undefined,
                expectation: undefined,
                costEstimated,
            }

            await AnswerExecutorTraceCollection.set(firestore, id, trace);
        }

        await doTrace();

        return {
            id,
            question,
            selected_documents: openai_answers_response.selected_documents.map(convertToSelectedDocumentWithRecord),
            answers: openai_answers_response.answers,
            model,
            search_model,
            timings
        }

    }

    /**
     * Given an OpenAI model name, return how much will a single "token" will cost
     * @see https://beta.openai.com/pricing/
     */
    function getPricePerToken(model: "ada" | "babbage" | "curie" | "davinci") {
        switch (model) {
            case "ada":
                return 0.0008 / 1000;
            case "babbage":
                return 0.0012 / 1000;
            case "curie":
                return 0.0060 / 1000;
            case "davinci":
                return 0.0600 / 1000;
        }
    }

}
