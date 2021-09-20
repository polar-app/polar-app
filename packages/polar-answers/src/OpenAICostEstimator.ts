import {AIModel} from "polar-answers-api/src/AIModel";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";
import {IOpenAIAnswersResponse} from "polar-answers-api/src/IOpenAIAnswersResponse";

export namespace OpenAICostEstimator {
    /**
     * Given an OpenAI model name, return how much will a single "token" will cost
     * @see https://beta.openai.com/pricing/
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
        return pricePerToken(opts.model) *
            (opts.documents.join('').length / 4)
            // "The 14 represents the additional tokens the API uses per document to accomplish the Semantic Search task"
            + (opts.documents.length + 1) * 14
            // The query is appended to every document in terms of cost
            + (opts.documents.length + 1) * (opts.query.length / 4);
    }

    export function costOfAnswers(request: IOpenAIAnswersRequest, response: IOpenAIAnswersResponse) {
        const searchCostInUSD = OpenAICostEstimator.costOfSearch({
            model: request.search_model ?? 'ada',
            query: request.question,
            documents: request.documents,
        });
        const completionCostInUSD = pricePerToken(request.model) *
            (
                (request.question.length / 4)
                + (request.max_tokens ?? 0)
                * (request.n ?? 0)
            );

        const fixedCostInUSD = pricePerToken(request.model) *
            (
                (request.examples_context.length / 4) // length of "examples_content"
                +
                request.examples
                    // Merge the "example" questions and answers
                    .map(value => value.join(''))
                    // Calculate the sum of their lengths
                    .reduce((previousValue, currentValue) => previousValue + currentValue.length, 0) / 4
                +
                request.question.length / 4 // add length of the original question
                +
                response.answers.join('').length / 4 // length of returned answer
            )

        return searchCostInUSD + completionCostInUSD + fixedCostInUSD;
    }
}
