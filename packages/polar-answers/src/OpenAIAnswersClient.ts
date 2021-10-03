import {IOpenAIAnswersResponse, IOpenAIAnswersResponseWithPrompt} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAIRequests} from "./OpenAIRequests";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {OpenAICostEstimator} from "./OpenAICostEstimator";
import {IAnswersCostEstimation, ICostEstimationHolder} from "polar-answers-api/src/ICostEstimation";

export namespace OpenAIAnswersClient {

    export async function exec(request: IOpenAIAnswersRequest): Promise<IOpenAIAnswersResponse & ICostEstimationHolder<IAnswersCostEstimation>> {

        const url = 'https://api.openai.com/v1/answers';

        const res = await OpenAIRequests.exec<IOpenAIAnswersRequest, IOpenAIAnswersResponse>(url, request);

        // eslint-disable-next-line camelcase
        const cost_estimation = OpenAICostEstimator.costOfAnswers(request, res as IOpenAIAnswersResponseWithPrompt);
        return {...res, cost_estimation};

    }

}
