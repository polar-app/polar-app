import {AIModel} from "polar-answers-api/src/AIModel";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {IOpenAIAnswersResponseWithPrompt} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {OpenAITokenEncoder} from "./OpenAITokenEncoder";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import { Reducers } from "polar-shared/src/util/Reducers";

export namespace OpenAICostEstimator {

    /**
     * US dollar cost as a floating point of dollars and cents.
     */
    export type USD = number;

    export interface ICostEstimation {
        readonly tokens: number;
        readonly cost: USD;
    }

    export interface ICostEstimationWithModel extends ICostEstimation {
        readonly model: AIModel;
    }

    /**
     * Given an OpenAI model name, return how much will a single "token" will cost
     * @see https://beta.openai.com/pricing/
     * The pricing page defines the price as "price per 1k tokens", hence the division by 1k
     */
    function pricePerToken(model: "ada" | "babbage" | "curie" | "davinci") {
        switch (model) {
            case "ada":
                return 0.0008 / 1000;
            case "babbage":
                return 0.0012 / 1000;
            case "curie":
                return 0.0060 / 1000;
            case "davinci":
                return 0.0600 / 1000;
        }
    }

    /**
     * The 14 represents the additional tokens the API uses per document to
     * accomplish the Semantic Search task
     */
    export const SEMANTIC_SEARCH_PER_DOC_OVERHEAD = 14;

    interface ICostOfSearchOpts {
        readonly model: AIModel,
        readonly query: string,
        readonly documents: ReadonlyArray<string>
    }

    /**
     * @see https://beta.openai.com/pricing/ - Section "How is pricing calculated for Search?"
     */
    export function costOfSearch(opts: ICostOfSearchOpts): ICostEstimationWithModel {

        const text = opts.documents.join(' ');

        const nrTokensForText = OpenAITokenEncoder.encode(text).length;
        const nrTokensForQuery = OpenAITokenEncoder.encode(opts.query).length;

        // @see https://beta.openai.com/pricing/ - Section "How is pricing calculated for Search?"
        const tokens = nrTokensForText +
            + ((opts.documents.length + 1) * SEMANTIC_SEARCH_PER_DOC_OVERHEAD)
            // The query is appended to every document in terms of cost
            + ((opts.documents.length + 1) * nrTokensForQuery);

        const {model} = opts;

        const cost = pricePerToken(model) * tokens;

        return {model, tokens, cost};
    }

    interface ICompletionResponseChoice {
        readonly text: string;
    }

    interface ICostOfCompletionOpts {
        readonly model: AIModel,
        readonly prompt: string;
        readonly choices: ReadonlyArray<ICompletionResponseChoice>;
    }

    export function costOfCompletion(opts: ICostOfCompletionOpts): ICostEstimationWithModel {

        const nrTokensForPrompt = OpenAITokenEncoder.nrTokens(opts.prompt);

        const nrTokensForChoices
                = arrayStream(opts.choices)
                    .map(current => OpenAITokenEncoder.nrTokens(current.text))
                    .collect()
                    .reduce(Reducers.SUM)

        const tokens = nrTokensForPrompt + nrTokensForChoices;

        const {model} = opts;
        const cost = pricePerToken(model) * tokens;

        return {model, tokens, cost}

    }

    export interface IAnswersCostEstimation extends ICostEstimation {
        readonly search: ICostEstimationWithModel,
        readonly completion: ICostEstimationWithModel;
    }

    export function costOfAnswers(request: IOpenAIAnswersRequest,
                                  response: IOpenAIAnswersResponseWithPrompt): IAnswersCostEstimation {

        const search = OpenAICostEstimator.costOfSearch({
            model: request.search_model ?? 'ada',
            query: request.question,
            documents: request.documents,
        });

        const completion = costOfCompletion({
            model: request.model,
            prompt: response.prompt,
            choices: response.answers.map(current => ({
                text: current
            }))
        });

        const tokens = search.tokens + completion.tokens;
        const cost = search.cost + completion.cost;

        return {
            tokens,
            cost,
            search,
            completion
        }

    }
}