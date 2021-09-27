import {ISelectedDocument} from "./ISelectedDocument";
import {AIModel} from "./AIModel";

export interface IOpenAIAnswersResponse {
    readonly prompt?: unknown;
    readonly answers: ReadonlyArray<string>;
    // eslint-disable-next-line camelcase
    readonly selected_documents: ReadonlyArray<ISelectedDocument>;
    // eslint-disable-next-line camelcase
    readonly search_model: AIModel;
    readonly model: AIModel;
}
