import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAIRequests} from "./OpenAIRequests";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";

export namespace OpenAIAnswersClient {

    export async function exec(request: IOpenAIAnswersRequest): Promise<IOpenAIAnswersResponse> {
        const url = 'https://api.openai.com/v1/answers'
        return OpenAIRequests.exec(url, request);
    }

}
