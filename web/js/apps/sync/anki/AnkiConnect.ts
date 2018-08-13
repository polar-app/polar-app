export interface AnkiConnectResult<T> {
    readonly result: T;
    readonly error: any; // TODO: not sure what type this is just yet.
}
