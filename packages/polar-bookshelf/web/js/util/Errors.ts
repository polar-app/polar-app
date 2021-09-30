export class Errors {

    /**
     * Create a new Error with an updated message so it can be rethrown.
     * @param err
     * @param message
     */
    public static rethrow(err: unknown, message: string) {
        
        const msg = `${message}: ${(err as any).message || 'none'}`;
        throw Object.assign({msg}, err);

    }

}
