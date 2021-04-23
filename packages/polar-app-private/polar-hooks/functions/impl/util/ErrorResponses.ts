
export class ErrorResponses {

    public static create(err?: string): ErrorResponse {
        return {err};
    }

}

interface ErrorResponse {

    /**
     * Human readable error string
     */
    readonly err?: string;

}

/**
 * An error message that has a code and a values dictionary so that we can decode *why* the error happened.
 */
interface CodedErrorResponse {

    /**
     * Human readable error string
     */
    readonly err: string;

    /**
     *
     */
    readonly code: string;

    readonly values: ValueMap;

}

/**
 * Keeps a map of value to format the error code in the UI for localization.
 */
export interface ValueMap {
    [key: string]: number | string;
}
