import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAIRequests} from "./OpenAIRequests";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";

export namespace OpenAIAnswersClient {

    /**
     * The max documents we're allowed to send to OpenAI in one pass.
     */
    export const MAX_DOCUMENTS = 200;

    export async function exec(request: IOpenAIAnswersRequest): Promise<IOpenAIAnswersResponse> {

        if (request.documents.length > MAX_DOCUMENTS) {
            throw new Error(`Too many documents exceeds ${MAX_DOCUMENTS}: ${request.documents.length}`);
        }

        const url = 'https://api.openai.com/v1/answers';

        return await OpenAIRequests.exec<IOpenAIAnswersRequest, IOpenAIAnswersResponse>(url, request);

    }

}
