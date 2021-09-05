import {AIModel} from "./AIModel";


export interface IAnswerExecutorRequest {

    readonly question: string;

    /**
     * When specified, use these documents rather than fetching from
     * Elasticsearch. This will simulate what OpenAI knows about the question
     * without any external document statements.
     */
    readonly documents?: ReadonlyArray<string>;

    readonly search_model?: AIModel;

    readonly model?: AIModel;
}
