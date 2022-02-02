import { google } from '@google-cloud/language/build/protos/protos';

export interface AutoClozeDeletionRequest {
    readonly text: string;
}

export interface AutoClozeDeletionResponse {
    clozeDeletions: ReadonlyArray<string>;
    readonly GCLResponse: google.cloud.language.v1.IAnalyzeEntitiesResponse;
}

export interface AutoClozeDeletionError {
    readonly error: 'no-result';
}