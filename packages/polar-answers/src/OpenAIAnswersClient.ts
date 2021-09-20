import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAIRequests} from "./OpenAIRequests";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {OpenAICostEstimator} from "./OpenAICostEstimator";

export namespace OpenAIAnswersClient {

    export async function exec(request: IOpenAIAnswersRequest): Promise<IOpenAIAnswersResponse> {
        const url = 'https://api.openai.com/v1/answers';
        return OpenAIRequests.exec<unknown, IOpenAIAnswersResponse>(url, request)
            .then((response: IOpenAIAnswersResponse) => {
                const cost = OpenAICostEstimator.costOfAnswers(request, response);
                // @TODO store in Firestore
                return response;
            }) as unknown as IOpenAIAnswersResponse;
    }

}
