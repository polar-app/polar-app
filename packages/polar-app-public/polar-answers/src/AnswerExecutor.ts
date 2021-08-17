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

    export async function exec(opts: IExecOpts): Promise<IAnswer> {

        const {question, uid} = opts;

        // run this query on the digest ...
        const index = ESAnswersIndexNames.createForUserDocs(uid);

        // FIXME this has to be hard coded and we only submit docs that would be
        // applicable to the answer API and we would need a way to easily
        // calculate the short head of the result set
        const size = 100;

        const esResponse: IElasticSearchResponse<IDigestDocument> = await ESRequests.doPost(`/${index}/_search`, {
            "query": {
                "query_string": {
                    "query": question,
                    "default_field": "text"
                }
            },
            size
        });

        // console.log(JSON.stringify(esResponse, null, "  "));

        // tslint:disable-next-line:variable-name
        const max_tokens=35

        // tslint:disable-next-line:variable-name
        const search_model='curie';
        const model = 'davinci';

        // tslint:disable-next-line:variable-name
        const examples_context="In 2017, U.S. life expectancy was 78.6 years.";

        const examples: ReadonlyArray<QuestionAnswerPair>= [
            ["What is human life expectancy in the United States?", "78 years."]
        ];

        const stop = ["\n", "<|endoftext|>"];

        const documents = esResponse.hits.hits.map(current => current._source.text);

        const request: OpenAIAnswersClient.IRequest = {
            search_model,
            model,
            question,
            examples_context,
            examples,
            max_tokens,
            stop,
            documents,
            n: 10
        }

        const answerResponse = await OpenAIAnswersClient.exec(request);

        return {
            question,
            ...answerResponse
        }

    }

}
