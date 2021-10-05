import {ESRequests} from "./ESRequests";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {FilterQuestionType} from "polar-answers-api/src/IAnswerExecutorRequest";
import {
    IAnswerExecutorCostEstimation,
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
import {IAnswerExecutorTrace, IAnswerExecutorTraceMinimal} from "polar-answers-api/src/IAnswerExecutorTrace";
import {AnswerExecutorTraceCollection} from "polar-firebase/src/firebase/om/AnswerExecutorTraceCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AnswerExecutorTracer} from "./AnswerExecutorTracer";
import {GCLAnalyzeSyntax} from "polar-google-cloud-language/src/GCLAnalyzeSyntax";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AnswerDigestRecordPruner} from "./AnswerDigestRecordPruner";
import {ShortHeadCalculator} from "./ShortHeadCalculator";
import {IAnswersCostEstimation, ICostEstimation} from "polar-answers-api/src/ICostEstimation";
import {AnswerExecutors} from "./AnswerExecutors";

const DEFAULT_DOCUMENTS_LIMIT = 200;
const DEFAULT_FILTER_QUESTION: FilterQuestionType = 'part-of-speech';

/**
 * The minimum docs needed to run the short head computation.
 */
const SHORT_HEAD_MIN_DOCS = 50;

/**
 * The max number of docs to return from the short head computation. Without
 * this we could exceed the 200 max per answers call.
 */
const SHORT_HEAD_MAX_DOCUMENTS = 50;

const SHORT_HEAD_ANGLE = 45;


export namespace AnswerExecutor {

    import IElasticSearchResponse = ESRequests.IElasticSearchResponse;
    import PartOfSpeechTag = GCLAnalyzeSyntax.PartOfSpeechTag;
    import IAnswerExecutorRequestWithUID = AnswerExecutors.IAnswerExecutorRequestWithUID;

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

            // eslint-disable-next-line camelcase
            readonly elasticsearch_pruned: undefined | number;

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

            // eslint-disable-next-line camelcase
            readonly openai_reranked_cost_estimation: undefined;

        }

        interface ESDocumentResultsWithRerank extends ESDocumentResultsBase {

            // eslint-disable-next-line camelcase
            readonly openai_reranked_records: ReadonlyArray<IAnswerDigestRecord>;

            // eslint-disable-next-line camelcase
            readonly openai_reranked_duration: number;

            // eslint-disable-next-line camelcase
            readonly openai_reranked_cost_estimation: ICostEstimation;

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

            function createElasticsearchQuery(): IElasticsearchQuery {
                return {
                    "query": {
                        "query_string": {
                            "query": queryText,
                            "default_field": "text"
                        }
                    },
                    "sort": [
                        request.elasticsearch_sort_order || '_score'
                    ],
                    size
                };
            }

            // TODO: trace the query
            // eslint-disable-next-line camelcase
            const elasticsearch_query = createElasticsearchQuery();

            // TODO: trace the requestURL
            // eslint-disable-next-line camelcase
            const elasticsearch_url = `/${index}*/_search?allow_no_indices=true`;

            interface IElasticsearchResults {

                // eslint-disable-next-line camelcase
                readonly elasticsearch_records: ReadonlyArray<IAnswerDigestRecord>;

                // eslint-disable-next-line camelcase
                readonly elasticsearch_duration: number;

                // eslint-disable-next-line camelcase
                readonly elasticsearch_pruned: undefined | number;

            }

            async function executeElasticsearch(): Promise<IElasticsearchResults> {

                // TODO: trace the esResponse
                // eslint-disable-next-line camelcase
                const [esResponse, elasticsearch_duration]
                    = await executeWithDuration<IElasticSearchResponse<IAnswerDigestRecord>>(ESRequests.doPost(elasticsearch_url, elasticsearch_query));

                // eslint-disable-next-line camelcase
                const elasticsearch_records = esResponse.hits.hits.map(current => current._source);

                return {
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_pruned: undefined
                };

            }

            async function executeElasticsearchWithPrune(): Promise<IElasticsearchResults> {

                // eslint-disable-next-line camelcase
                const {elasticsearch_records, elasticsearch_duration} = await executeElasticsearch();

                const recordPruned = AnswerDigestRecordPruner.prune(elasticsearch_records);

                return {
                    elasticsearch_records: recordPruned,
                    elasticsearch_duration,
                    elasticsearch_pruned: elasticsearch_records.length - recordPruned.length
                }

            }

            // eslint-disable-next-line camelcase
            const {elasticsearch_records, elasticsearch_duration, elasticsearch_pruned} =
                request.prune_contiguous_records ?
                    await executeElasticsearchWithPrune() :
                    await executeElasticsearch();

            // TODO: do this in the indexer, not the executor? this way we can
            // same some CPU time during execution.

            if (request.rerank_elasticsearch) {

                console.log("Re-ranking N ES results via OpenAI: " + elasticsearch_records.length)

                // TODO: technically if we have < 200 documents, the re-rank
                // isn't really needed and would in fact cost us more money
                // because we re-rank again with currie.

                // TODO: trace the latency of the rerank too..

                // TODO: trace the ranked
                // eslint-disable-next-line camelcase
                const [openai_reranked_records_with_score, openai_reranked_duration] =
                    await executeWithDuration(OpenAISearchReRanker.exec(request.rerank_elasticsearch_model || 'ada',
                                                                        request.question,
                                                                        elasticsearch_records,
                                                                        hit => hit.text));

                // eslint-disable-next-line camelcase
                const openai_reranked_records
                    = arrayStream(openai_reranked_records_with_score.records)
                        .map(current => current.record)
                        .collect();

                // eslint-disable-next-line camelcase
                function computeRecords() {

                    function computeLimit() {

                        if (request.rerank_truncate_short_head && openai_reranked_records_with_score.records.length > SHORT_HEAD_MIN_DOCS) {

                            console.log("Re-ranking N results with short head..." + openai_reranked_records_with_score.records.length);

                            const head = ShortHeadCalculator.compute(openai_reranked_records_with_score.records.map(current => current.score), SHORT_HEAD_ANGLE);

                            if (head) {
                                console.log("Short head truncated to N entries: " + head.length)
                                return Math.min(head.length, SHORT_HEAD_MAX_DOCUMENTS);
                            } else {
                                console.warn("No short head computed");
                            }
                        }

                        // eslint-disable-next-line camelcase
                        return documents_limit;

                    }

                    const limit = computeLimit();

                    // eslint-disable-next-line camelcase
                    return arrayStream(openai_reranked_records)
                        .head(limit)
                        .collect();

                }

                // eslint-disable-next-line camelcase
                const records = computeRecords();

                return <ESDocumentResultsWithRerank> {
                    elasticsearch_query,
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_hits: elasticsearch_records.length,
                    elasticsearch_indexes: [index],
                    elasticsearch_url,
                    openai_reranked_records,
                    openai_reranked_duration,
                    openai_reranked_cost_estimation: {
                        cost: openai_reranked_records_with_score.cost_estimation.cost,
                        tokens: openai_reranked_records_with_score.cost_estimation.tokens,
                    },
                    records,
                    elasticsearch_pruned
                };

            } else {

                const records = arrayStream(elasticsearch_records)
                    .head(documents_limit)
                    .collect();

                // eslint-disable-next-line camelcase
                return <ESDocumentResultsWithoutRerank> {
                    elasticsearch_query,
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_hits: elasticsearch_records.length,
                    elasticsearch_indexes: [index],
                    elasticsearch_url,
                    openai_reranked_records: undefined,
                    openai_reranked_duration: undefined,
                    openai_reranked_cost_estimation: undefined,
                    records,
                    elasticsearch_pruned
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
            max_tokens: request.max_tokens || MAX_TOKENS,
            stop: STOP,
            documents,
            n: N,
            temperature: TEMPERATURE,
            return_metadata: RETURN_METADATA,
            return_prompt: true
        }

        // TODO: trace this.
        // eslint-disable-next-line camelcase
        const [openai_answers_response, openai_answer_duration] = await executeWithDuration(OpenAIAnswersClient.exec(openai_answers_request));

        const primaryAnswer = Arrays.first(openai_answers_response.answers);

        function computeCostEstimation(): IAnswerExecutorCostEstimation {

            const NULL_COSTS = {
                cost: 0,
                tokens: 0
            }

            // eslint-disable-next-line camelcase
            const openai_rerank_cost_estimation: ICostEstimation = computedDocuments.openai_reranked_cost_estimation || NULL_COSTS;

            // eslint-disable-next-line camelcase
            const openai_answer_api_cost_estimation: IAnswersCostEstimation = {
                cost: openai_answers_response.cost_estimation.cost,
                tokens: openai_answers_response.cost_estimation.tokens,
                search: openai_answers_response.cost_estimation.search,
                completion: openai_answers_response.cost_estimation.completion,
            }

            const cost = openai_rerank_cost_estimation.cost + openai_answer_api_cost_estimation.cost;
            const tokens = openai_rerank_cost_estimation.tokens + openai_answer_api_cost_estimation.tokens;

            return {
                cost, tokens,
                openai_rerank_cost_estimation,
                openai_answer_api_cost_estimation
            };

        }

        // eslint-disable-next-line camelcase
        const cost_estimation = computeCostEstimation();

        if (primaryAnswer === NO_ANSWER_CODE) {

            // TODO: timings here are important too.

            return {
                error: true,
                code: 'no-answer',
                cost_estimation
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

        async function doTrace(): Promise<IAnswerExecutorTrace> {

            const firestore = FirestoreAdmin.getInstance();

            const trace: IAnswerExecutorTraceMinimal = {
                id,
                created: ISODateTimeStrings.create(),
                type: 'trace-minimal',
                ver: 'v2',
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
                elasticsearch_pruned: computedDocuments.elasticsearch_pruned
            }

            await AnswerExecutorTraceCollection.set(firestore, id, trace);

            console.log("Stored trace data in firestore: ", JSON.stringify(trace, null, "  "));

            return trace;

        }

        await doTrace();

        return {
            id,
            question,
            selected_documents: openai_answers_response.selected_documents.map(convertToSelectedDocumentWithRecord),
            answers: openai_answers_response.answers,
            model,
            search_model,
            timings,
            cost_estimation
        }

    }

}
