/**
 * Represents a Result of some computation that usually needs to be represented
 * as either a value or an error.  We often use these for RPC / IPC.
 */
export class Result<T> {

    public readonly value: T;

    public readonly err: Error;

    public constructor(value: T, err: Error) {
        this.value = value;
        this.err = err;
    }

}
