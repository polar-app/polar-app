/**
 * AnkiConnect will respond with an object containing two fields: result and
 * error. The result field contains the return value of the executed API, and
 * the error field is a description of any exception thrown during API execution
 * (the value null is used if execution completed successfully).
 */
export interface AnkiConnectResponse {
    readonly result: any;
    readonly error: string;
}
