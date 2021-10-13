import {ESRequests} from "./ESRequests";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {FilterQuestionType} from "polar-answers-api/src/IAnswerExecutorRequest";
import {
    IAnswerEntity,
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
import {IOpenAIAnswersRequest, QuestionAnswerPair} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {IElasticsearchQuery} from "polar-answers-api/src/IElasticsearchQuery";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IAnswerExecutorTrace, IAnswerExecutorTraceMinimal} from "polar-answers-api/src/IAnswerExecutorTrace";
import {AnswerExecutorTraceCollection} from "polar-firebase/src/firebase/om/AnswerExecutorTraceCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AnswerExecutorTracer} from "./AnswerExecutorTracer";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AnswerDigestRecordPruner} from "./AnswerDigestRecordPruner";
import {ShortHeadCalculator} from "./ShortHeadCalculator";
import {AnswerExecutors} from "./AnswerExecutors";
import {OpenAICompletionCleanup} from "./OpenAICompletionCleanup";
import {QuestionFilters} from "./QuestionFilters";
import {GCLAnalyzeEntities} from "polar-google-cloud-language/src/GCLAnalyzeEntities";

const DEFAULT_DOCUMENTS_LIMIT = 200;
const DEFAULT_FILTER_QUESTION: FilterQuestionType = 'part-of-speech';

export namespace AnswerExecutor {

    import IElasticSearchResponse = ESRequests.IElasticSearchResponse;
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

    export const SEARCH_MODEL = 'curie';

    export const MODEL = 'curie';

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

    export interface IAnswerExecutionSuccess {

        readonly response: IAnswerExecutorResponse;

        readonly trace: IAnswerExecutorTrace;

        /**
         * The prompt generated/used by the OpenAI answers API.
         */
        readonly prompt: string;

    }

    export interface IAnswerExecutionFailure {

        readonly response: IAnswerExecutorError;
        readonly trace: IAnswerExecutorTrace;

    }

    export type IAnswerExecution = IAnswerExecutionSuccess | IAnswerExecutionFailure;

    export function computeRequestWithDefaults(req: IAnswerExecutorRequestWithUID): Required<IAnswerExecutorRequestWithUID> {
        return {
            uid: req.uid,
            question: req.question,
            search_model: req.search_model || 'curie',
            model: req.model || 'curie',
            documents_limit: req.documents_limit || 200,
            filter_question: req.filter_question || 'part-of-speech-noun',
            filter_question_joiner: req.filter_question_joiner || 'OR',
            rerank_elasticsearch: req.rerank_elasticsearch || true,
            rerank_elasticsearch_size: req.rerank_elasticsearch_size || 500,
            rerank_elasticsearch_model: req.rerank_elasticsearch_model || 'ada',
            rerank_truncate_short_head: req.rerank_truncate_short_head || true,
            prune_contiguous_records: req.prune_contiguous_records || true,
            elasticsearch_sort_order: req.elasticsearch_sort_order || 'idx',
            elasticsearch_truncate_short_head: req.elasticsearch_truncate_short_head || {
                target_angle: 30,
                min_docs: 50,
                max_docs: 50
            },
            max_tokens: req.max_tokens || 125,
            openai_completion_cleanup_enabled: req.openai_completion_cleanup_enabled || true
        }
    }

    export async function exec(req: IAnswerExecutorRequestWithUID): Promise<IAnswerExecution> {

        const request = computeRequestWithDefaults(req);
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

                // TODO/FIXME we are NOT controlling our inputs here and it
                // would be possible for someone to push down a regex or other
                // issues and we need to fix this by using a real term query.

                // eslint-disable-next-line camelcase
                const filter_question = request.filter_question || DEFAULT_FILTER_QUESTION;

                // eslint-disable-next-line camelcase
                const filter_question_joiner = request.filter_question_joiner || 'none';

                return await QuestionFilters.filter(request.question,
                                                    filter_question,
                                                    filter_question_joiner);

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
                readonly elasticsearch_hits: number;

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

                function computeElasticsearchRecords() {

                    function computeLimit(): number {

                        if (request.elasticsearch_truncate_short_head) {
                            console.log("Computing short head on Elasticsearch results: ", request.elasticsearch_truncate_short_head);
                            const head = ShortHeadCalculator.compute(esResponse.hits.hits.map(current => current._score), request.elasticsearch_truncate_short_head);
                            if (head) {
                                return head.length;
                            }
                        }

                        return esResponse.hits.hits.length;

                    }

                    const limit = computeLimit();

                    return arrayStream(esResponse.hits.hits.map(current => current._source))
                               .head(limit)
                               .collect()

                }

                // eslint-disable-next-line camelcase
                const elasticsearch_records = computeElasticsearchRecords();

                return {
                    elasticsearch_records,
                    elasticsearch_duration,
                    elasticsearch_pruned: undefined,
                    elasticsearch_hits: esResponse.hits.total.value
                };

            }

            async function executeElasticsearchWithPrune(): Promise<IElasticsearchResults> {

                // eslint-disable-next-line camelcase
                const {elasticsearch_records, elasticsearch_duration, elasticsearch_hits} = await executeElasticsearch();

                const recordPruned = AnswerDigestRecordPruner.prune(elasticsearch_records);

                return {
                    elasticsearch_records: recordPruned,
                    elasticsearch_duration,
                    elasticsearch_pruned: elasticsearch_records.length - recordPruned.length,
                    elasticsearch_hits
                }

            }

            // eslint-disable-next-line camelcase
            const {elasticsearch_records, elasticsearch_duration, elasticsearch_pruned, elasticsearch_hits} =
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

                        if (request.rerank_truncate_short_head) {

                            // TODO: include truncate before and after in the trace and include this in the regression
                            // report

                            console.log("Re-ranking N results with short head: " + openai_reranked_records_with_score.records.length);

                            const head = ShortHeadCalculator.compute(openai_reranked_records_with_score.records.map(current => current.score),{
                                target_angle: 45,
                                min_docs: 50,
                                max_docs: 50
                            });

                            if (head) {
                                return head.length;
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
                    elasticsearch_hits,
                    elasticsearch_indexes: [index],
                    elasticsearch_url,
                    openai_reranked_records,
                    openai_reranked_duration,
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
                    elasticsearch_hits,
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
        //
        // function computeCostEstimation(): IAnswerExecutorCostEstimation {
        //
        //     const NULL_COSTS = {
        //         cost: 0,
        //         tokens: 0
        //     }
        //
        //     // eslint-disable-next-line camelcase
        //     const openai_rerank_cost_estimation: ICostEstimation = computedDocuments.openai_reranked_cost_estimation || NULL_COSTS;
        //
        //     // eslint-disable-next-line camelcase
        //     const openai_answer_api_cost_estimation: IAnswersCostEstimation = {
        //         cost: openai_answers_response.cost_estimation.cost,
        //         tokens: openai_answers_response.cost_estimation.tokens,
        //         search: openai_answers_response.cost_estimation.search,
        //         completion: openai_answers_response.cost_estimation.completion,
        //     }
        //
        //     const cost = openai_rerank_cost_estimation.cost + openai_answer_api_cost_estimation.cost;
        //     const tokens = openai_rerank_cost_estimation.tokens + openai_answer_api_cost_estimation.tokens;
        //
        //     return {
        //         cost, tokens,
        //         openai_rerank_cost_estimation,
        //         openai_answer_api_cost_estimation
        //     };
        //
        // }
        //
        // // eslint-disable-next-line camelcase
        // const cost_estimation = computeCostEstimation();

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

        const trace = await doTrace();

        if (primaryAnswer === NO_ANSWER_CODE) {

            return {
                trace,
                response: {
                    error: true,
                    code: 'no-answer'
                }
            }

        }

        async function createAnswers(): Promise<ReadonlyArray<string>> {

            if (request.openai_completion_cleanup_enabled) {
                const promises = openai_answers_response.answers.map(current => OpenAICompletionCleanup.clean(current));
                return (await Promise.all(promises)).map(current => current.text);
            }

            return openai_answers_response.answers;
        }

        const answers = await createAnswers();

        async function computeEntities(): Promise<ReadonlyArray<IAnswerEntity>> {

            async function doEntities(text: string | undefined, type: 'question' | 'answer'): Promise<ReadonlyArray<IAnswerEntity>> {

                if (! text) {
                    return [];
                }

                const entities = await GCLAnalyzeEntities.analyzeEntities(text);
                return (entities.entities || []).map((current): IAnswerEntity => {
                    return {
                        text: current.name!,
                        type
                    }
                })
            }

            const promises = [
                doEntities(question, 'question'),
                doEntities(primaryAnswer, 'answer')
            ]

            return arrayStream(await Promise.all(promises))
                .flatMap(current => current)
                .collect()

        }

        // TODO: these timings need to be included.
        const entities = await computeEntities();

        const response: IAnswerExecutorResponse = {
            id,
            question,
            selected_documents: openai_answers_response.selected_documents.map(convertToSelectedDocumentWithRecord),
            answers,
            model,
            search_model,
            timings,
            entities
        };

        return {
            response,
            trace,
            prompt: openai_answers_response.prompt || ''
        }

    }

}
