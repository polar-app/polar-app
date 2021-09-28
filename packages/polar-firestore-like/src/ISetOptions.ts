/**
 * An options object that configures the behavior of `set()` calls in
 * `DocumentReference`, `WriteBatch` and `Transaction`. These calls can be
 * configured to perform granular merges instead of overwriting the target
 * documents in their entirety.
 */
export interface ISetOptions {

    /**
     * Changes the behavior of a set() call to only replace the values specified
     * in its data argument. Fields omitted from the set() call remain
     * untouched.
     */
    readonly merge?: boolean;

    /**
     * Changes the behavior of set() calls to only replace the specified field
     * paths. Any field path that is not specified is ignored and remains
     * untouched.
     */
    readonly mergeFields?: (string /* | FieldPath */)[];

}

