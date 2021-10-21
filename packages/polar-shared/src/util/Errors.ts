/**
 * JS and TS use known for Error but JS can throw Error or string or numbers
 */
export type ErrorType = unknown;

export namespace Errors {

    /**
     * Create a new Error with an updated message so it can be rethrown.
     * @param err
     * @param message
     */
    export function rethrow(err: unknown, message: string) {

        const msg = `${message}: ${(err as any).message || 'none'}`;
        throw Object.assign({msg}, err);

    }

}
