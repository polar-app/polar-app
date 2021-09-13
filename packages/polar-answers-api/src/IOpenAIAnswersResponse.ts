/* eslint-disable camelcase */
import {ISelectedDocument} from "./ISelectedDocument";
import {AIModel} from "./AIModel";

export interface IOpenAIAnswersResponse {
    readonly answers: ReadonlyArray<string>;
    readonly selected_documents: ReadonlyArray<ISelectedDocument>;
    readonly search_model: AIModel;
    readonly model: AIModel;
}
