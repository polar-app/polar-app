import {AIModel} from "polar-answers-api/src/AIModel";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";

const {encode} = require('gpt-3-encoder');

export namespace OpenAICostEstimator {
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
     * @see https://beta.openai.com/pricing/ - Section "How is pricing calculated for Search?"
     */
    export function costOfSearch(opts: {
        model: AIModel,
        query: string,
        documents: ReadonlyArray<string>
    }) {
        // @see https://beta.openai.com/pricing/ - Section "How is pricing calculated for Search?"
        const tokensUsed = encode(opts.documents.join('')).length
            // "The 14 represents the additional tokens the API uses per document to accomplish the Semantic Search task"
            + ((opts.documents.length + 1) * 14)
            // The query is appended to every document in terms of cost
            + ((opts.documents.length + 1) * encode(opts.query).length);

        return pricePerToken(opts.model) * tokensUsed;
    }

    export function costOfAnswers(request: IOpenAIAnswersRequest, response: IOpenAIAnswersResponse) {
        const searchCostInUSD = OpenAICostEstimator.costOfSearch({
            model: request.search_model ?? 'ada',
            query: request.question,
            documents: request.documents,
        });

        const completionCostInUSD = pricePerToken(request.model) *
            (
                encode(response.prompt ?? request.question).length
                + (
                    (request.max_tokens ?? 16)
                    * (request.n ?? 1)
                )
            );

        const fixedCostInUSD = pricePerToken(request.model) *
            (
                encode(request.examples_context).length // length of "examples_content"
                +
                request.examples
                    // Merge the "example" questions and answers
                    .map(value => value.join(''))
                    // Calculate the sum of their lengths
                    .reduce((previousValue, currentValue) => previousValue + encode(currentValue).length, 0)
                +
                encode(response.prompt ?? request.question).length  // add length of the original question
                +
                encode(response.answers.join('')).length // length of returned answer
            )

        return searchCostInUSD + completionCostInUSD + fixedCostInUSD;
    }
}
