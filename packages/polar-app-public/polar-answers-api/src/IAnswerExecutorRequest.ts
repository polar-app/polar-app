import {AIModel} from "./AIModel";


export interface IAnswerExecutorRequest {
    readonly question: string;
    readonly search_model?: AIModel;
    readonly model?: AIModel;
}
