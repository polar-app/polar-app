import {ESRequests} from "./ESRequests";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {UserIDStr} from "polar-shared/src/util/Strings";
import {IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {
    IAnswerExecutorError,
    IAnswerExecutorResponse,
    ISelectedDocumentWithRecord,
    ITimings
} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ISelectedDocument} from "polar-answers-api/src/ISelectedDocument";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace AnswerExecutor {

    import QuestionAnswerPair = OpenAIAnswersClient.QuestionAnswerPair;
    import IElasticSearchResponse = ESRequests.IElasticSearchResponse;

    export interface IExecOpts extends IAnswerExecutorRequest {
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

    export const N = 10;

    export interface ResultWithDuration<V> {
        readonly value: V;
        readonly duration: number;
    }

    export async function executeWithDuration<V>(delegate: () => Promise<V>): Promise<ResultWithDuration<V>> {

        const before = Date.now();
        const value = await delegate();
        const after = Date.now();

        const duration = after - before;

        return {value, duration};

    }

    export async function exec(opts: IExecOpts): Promise<IAnswerExecutorResponse | IAnswerExecutorError> {

        const {question, uid} = opts;

        // FIXME: is the right ansewr the FIRST or LAST?

        interface DocumentResults {
            readonly duration: number;
            readonly records: ReadonlyArray<IAnswerDigestRecord>;
            readonly documents: ReadonlyArray<string>
        }

        async function computeDocuments() {

            if (opts.documents) {
                return computeDocumentsFromOpts();
            }

            return computeDocumentsFromES();

        }

        async function computeDocumentsFromOpts(): Promise<DocumentResults> {

            const documents = opts.documents || [];

            return {
                duration: 0,
                documents,
                records: documents.map((current, idx) => {
                    return {
                        type: 'none',
                        text: current,
                        idx
                    }
                })
            };

        }

        async function computeDocumentsFromES(): Promise<DocumentResults> {

            // TODO make this into a generic search client and don't hard code the ES query here.

            // run this query on the digest ...
            const index = ESAnswersIndexNames.createForUserDocs(uid);

            // TODO this has to be hard coded and we only submit docs that would be
            // applicable to the answer API and we would need a way to easily
            // calculate the short head of the result set.  The OpenAI Answers API
            // only allows 200 documents so we might just want to hard code this.
            const size = 100;

            const query = {
                "query": {
                    "query_string": {
                        "query": question,
                        "default_field": "text"
                    }
                },
                size
            };

            const requestURL = `/${index}/_search`;

            const esResponseWithDuration
                = await executeWithDuration<IElasticSearchResponse<IAnswerDigestRecord>>(() => ESRequests.doPost(requestURL, query));

            const esResponse = esResponseWithDuration.value;

            // I believe the non-deterministic results you see might be caused by
            // the order in which the documents selected by the Answers endpoint are
            // inserted into the final completion prompt (Answers endpoint is
            // indeed Search+Completions under the hood).
            //
            // To confirm this hypothesis, I would pass return_prompt = True for
            // each API call and see how the final prompt differs between calls.

            // the array of digest records so that we can map from the
            // selected_documents AFTER the request is executed.
            const records = esResponse.hits.hits.map(current => current._source);

            const documents = records.map(current => current.text.replace(/\n/g, ' '));

            return {
                duration: esResponseWithDuration.duration,
                documents,
                records
            };

        }

        const {duration, documents, records} = await computeDocuments();

        // TODO how do we compute documents which have no known answer?

        // Assuming your temperature is already at 0 (making the API less likely
        // to confabulate), you can show the API how to say "Unknown" using
        // examples and examples_context. For instance, one example could be
        // "Who invented Cottage Cheese?", "Unknown" Another example could be
        // "When was the first Olympics?", "Unknown" Of course, you'll want
        // examples that are answered by the examples_context as well. Does this
        // make sense?

        // tslint:disable-next-line:variable-name
        const search_model = opts.search_model || SEARCH_MODEL;
        const model = opts.model || MODEL;

        const request: OpenAIAnswersClient.IRequest = {
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

        const answerResponseWithDuration = await executeWithDuration(() => OpenAIAnswersClient.exec(request));
        const answerResponse = answerResponseWithDuration.value;

        const primaryAnswer = Arrays.first(answerResponse.answers);

        if (primaryAnswer === NO_ANSWER_CODE) {

            return {
                error: 'no-answer'
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

        const timings: ITimings = {
            documents: duration,
            openai: answerResponseWithDuration.duration
        }

        return {
            question,
            selected_documents: answerResponse.selected_documents.map(convertToSelectedDocumentWithRecord),
            answers: answerResponse.answers,
            model,
            search_model,
            timings
        }

    }

}
