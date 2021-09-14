export namespace AutoFlashcards {

    export interface AutoFlashcardRequest {
        // eslint-disable-next-line camelcase
        readonly query_text: string;
    }

    export interface AutoFlashcardResponse {
        readonly front: string;
        readonly back: string;
    }

    export interface AutoFlashcardError {
        readonly error: 'no-result' |  'input-too-long';
    }

    export function isError(response: AutoFlashcardResponse | AutoFlashcardError): response is AutoFlashcardError {
        return (response as any).error !== undefined;
    }

}