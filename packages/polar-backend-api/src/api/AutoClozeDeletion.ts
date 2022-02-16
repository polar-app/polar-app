import { GCL } from "./GCL";

export namespace AutoClozeDeletions {

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

    export function isError(response: AutoClozeDeletionResponse | AutoClozeDeletionError): response is AutoClozeDeletionError {
        return (response as any).error !== undefined;
    }
}
