/**
 * Represents a Result of some computation that usually needs to be represented
 * as either a value or an error.  We often use these for RPC / IPC.
 */
export interface IResult<T> {

    readonly value?: T;

    readonly err?: unknown;

}

export class Result<T> implements IResult<T> {

    public readonly value?: T;

    public readonly err?: unknown;

    constructor(opts: IResult<T>) {
        this.value = opts.value;
        this.err = opts.err;
    }

    public hasValue(): boolean {
        return this.value !== undefined;
    }

    public get(): T {

        if (this.value !== undefined) {
            return this.value;
        }

        // eslint-disable-next-line no-throw-literal
        throw this.err!;

    }

    public toJSON(): any {

        if (this.value !== undefined) {

            return {
                value: this.value
            };

        } else if (this.err !== undefined) {

            return {
                err: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name: (this.err as any).name || 'none',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    message: (this.err as any).message || undefined,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    stack: (this.err as any).stack || []
                }
            };

        } else {
            throw new Error("Neither value nor err");
        }

    }

}
