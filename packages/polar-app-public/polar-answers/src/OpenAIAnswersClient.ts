import {Fetches} from "polar-shared/src/util/Fetch";

export namespace OpenAIAnswersClient {

    type AIModel = 'ada' | 'babbage' | 'curie' | 'davinci';

    export type QuestionAnswerPair = [string, string];

    export interface IAnswerDocument {
        readonly text: string;
        readonly metadata: {[key: string]: string |  number};
    }

    export interface IRequest {

        readonly model: AIModel;

        /**
         * Question to get answered.
         */
        readonly question: string;

        /** List of (question, answer) pairs that will help steer the model
         * towards the tone and answer format you'd like. We recommend adding 2
         * to 3 examples.
         */
        readonly examples: ReadonlyArray<QuestionAnswerPair>;

        readonly examples_context: string;

        /**
         * List of documents from which the answer for the input question should
         * be derived. If this is an empty list, the question will be answered
         * based on the question-answer examples.
         */
        readonly documents: ReadonlyArray<string | IAnswerDocument>;

        /**
         * ID of the engine to use for Search.
         *
         * Defaults to ada
         */
        readonly search_model?: AIModel;

        /**
         * What sampling temperature to use. Higher values mean the model will
         * take more risks and value 0 (argmax sampling) works better for
         * scenarios with a well-defined answer.
         */
        readonly temperature? : number;

        /**
         * Include the log probabilities on the logprobs most likely tokens, as
         * well the chosen tokens. For example, if logprobs is 10, the API will
         * return a list of the 10 most likely tokens. the API will always
         * return the logprob of the sampled token, so there may be up to
         * logprobs+1 elements in the response.
         *
         * When logprobs is set, completion will be automatically added into
         * expand to get the logprobs.
         */
        readonly logprobs?: number;

        /**
         * The maximum number of tokens allowed for the generated answer
         */
        readonly max_tokens?: number;

        /**
         * How many answers to generate for each question.
         */
        readonly n?: number;

        readonly stop?: string | ReadonlyArray<string>;

        /**
         * A special boolean flag for showing metadata. If set to true, each
         * document entry in the returned JSON will contain a "metadata" field.
         */
        readonly return_metadata?: boolean;

        /**
         * If set to true, the returned JSON will include a "prompt" field
         * containing the final prompt that was used to request a completion.
         * This is mainly useful for debugging purposes.
         */
        readonly return_prompt?: boolean;

    }

    export interface ISelectedDocument {
        readonly document: number;
        readonly text: string;
        readonly object: string;
        readonly score: number;
    }

    export interface IResponse {
        readonly answers: ReadonlyArray<string>;
        readonly selected_documents: ReadonlyArray<ISelectedDocument>;
    }

    export async function exec(request: IRequest): Promise<IResponse> {

        const url = 'https://api.openai.com/v1/answers'

        const apiKey = process.env.OPENAI_API_KEY;

        if (! apiKey) {
            throw new Error("No OPENAI_API_KEY in environment");
        }

        const response = await Fetches.fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Invalid response: ${response.status}: ${response.statusText}`);
    }

}
