import {OpenAIAnswersClient} from "polar-answers/src/OpenAIAnswersClient";
import { ISelectedDocument } from "./ISelectedDocument";
import {IAnswerDigestRecord} from "./IAnswerDigestRecord";

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

export interface IAnswerExecutorResponse extends OpenAIAnswersClient.IResponse {
    readonly question: string;
    readonly selected_documents: ReadonlyArray<ISelectedDocumentWithRecord<IAnswerDigestRecord>>;
    readonly timings: ITimings;
}
