import {ESRequests} from "./ESRequests";
import {ESDigester} from "./ESDigester";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import { UserIDStr } from "polar-shared/src/util/Strings";

export namespace AnswerExecutor {

    import IDigestDocument = ESDigester.IDigestDocument;
    import QuestionAnswerPair = OpenAIAnswersClient.QuestionAnswerPair;
    import IElasticSearchResponse = ESRequests.IElasticSearchResponse;

    export interface IExecOpts {
        readonly uid: UserIDStr;
        readonly question: string;
    }

    export interface IAnswer extends OpenAIAnswersClient.IResponse {
        readonly question: string;
    }

    export const EXAMPLES_CONTEXT = "In 2017, U.S. life expectancy was 78.6 years.";

    export const EXAMPLES: ReadonlyArray<QuestionAnswerPair> = [
        ["What is human life expectancy in the United States?", "78 years."],
        ["Who is the President of Xexptronica", "__UNKNOWN__"],
        ["What do dinosaurs capilate?", "__UNKNOWN__"],
        ["Is foo a bar?", "__UNKNOWN__"]
    ];

    export const STOP = ["\n", "<|endoftext|>"];

    export const MAX_TOKENS = 150;

    export const SEARCH_MODEL = 'curie';

    export const MODEL = 'davinci';

    export const TEMPERATURE = 0;

    export async function exec(opts: IExecOpts): Promise<IAnswer> {

        const {question, uid} = opts;

        // run this query on the digest ...
        const index = ESAnswersIndexNames.createForUserDocs(uid);

        // FIXME this has to be hard coded and we only submit docs that would be
        // applicable to the answer API and we would need a way to easily
        // calculate the short head of the result set
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
        const esResponse: IElasticSearchResponse<IDigestDocument> = await ESRequests.doPost(requestURL, query);

        // console.log(`ES response to ${requestURL}`, JSON.stringify(esResponse, null, "  "));

        // tslint:disable-next-line:variable-name
        // tslint:disable-next-line:variable-name

        // tslint:disable-next-line:variable-name

        // FIXME: include metadata here - don't just use the source text.  We
        // need the metadata as part of the results.
        function toDocument(doc: IDigestDocument) {

            return {
                text: doc.text,
                metadata: {
                    id: doc.idx
                }

            }

        }

        const documents = esResponse.hits.hits.map(current => current._source.text);

        // TODO how do we compute documents which have no known answer?

        // Assuming your temperature is already at 0 (making the API less likely
        // to confabulate), you can show the API how to say "Unknown" using
        // examples and examples_context. For instance, one example could be
        // "Who invented Cottage Cheese?", "Unknown" Another example could be
        // "When was the first Olympics?", "Unknown" Of course, you'll want
        // examples that are answered by the examples_context as well. Does this
        // make sense?

        const request: OpenAIAnswersClient.IRequest = {
            search_model: SEARCH_MODEL,
            model: MODEL,
            question,
            examples_context: EXAMPLES_CONTEXT,
            examples: EXAMPLES,
            max_tokens: MAX_TOKENS,
            stop: STOP,
            documents,
            n: 10,

            // FIXME: I have to play with temperature more...
            temperature: TEMPERATURE
        }

        const answerResponse = await OpenAIAnswersClient.exec(request);

        return {
            question,
            ...answerResponse
        }

    }

}
