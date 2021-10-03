import {IOpenAIAnswersResponse, IOpenAIAnswersResponseWithPrompt} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAIRequests} from "./OpenAIRequests";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {OpenAICostEstimator} from "./OpenAICostEstimator";
import {IAnswersCostEstimation} from "polar-answers-api/src/ICostEstimation";

export namespace OpenAIAnswersClient {

    export async function exec(request: IOpenAIAnswersRequest): Promise<IOpenAIAnswersResponse & IAnswersCostEstimation> {

        const url = 'https://api.openai.com/v1/answers';

        const res = await OpenAIRequests.exec<IOpenAIAnswersRequest, IOpenAIAnswersResponse>(url, request);

        const cost = OpenAICostEstimator.costOfAnswers(request, res as IOpenAIAnswersResponseWithPrompt);
        return {...res, ...cost};

    }

}
