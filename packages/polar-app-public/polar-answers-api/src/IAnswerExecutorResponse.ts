import { ISelectedDocument } from "./ISelectedDocument";
import {IAnswerDigestRecord} from "./IAnswerDigestRecord";
import {IOpenAIAnswersResponse} from "./IOpenAIAnswersResponse";

export interface ITimings {

    /**
     * The amount of time it took to compute the documents to query over.
     */
    readonly documents: number;

    /**
     * The amount of time it took to query against OpenAI.
     */
    readonly openai: number;

}

export interface ISelectedDocumentWithRecord<R>  extends ISelectedDocument {

    /**
     * The original record for this document
     */
    readonly record: R;

}

export interface IAnswerExecutorResponse extends IOpenAIAnswersResponse {
    readonly question: string;
    readonly selected_documents: ReadonlyArray<ISelectedDocumentWithRecord<IAnswerDigestRecord>>;
    readonly timings: ITimings;
}

export interface IAnswerExecutorError {
    readonly error: 'failed';
    readonly message: string;
}
