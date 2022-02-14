import { GCL } from "./GCL";

export interface AutoClozeDeletionRequest {
    readonly text: string;
}

export interface AutoClozeDeletionResponse {
    readonly text: string;
    readonly GCLResponse: GCL.IAnalyzeEntitySentimentResponse;
}

export interface AutoClozeDeletionError {
    readonly error: 'no-result';
}