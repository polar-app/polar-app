/**
 * An options object that configures conditional behavior of `update()` and
 * `delete()` calls in `DocumentReference`, `WriteBatch`, and `Transaction`.
 * Using Preconditions, these calls can be restricted to only apply to
 * documents that match the specified restrictions.
 */
export interface IPrecondition {

    /**
     * If set, the last update time to enforce.
     */
    readonly lastUpdateTime?: any /* Timestamp */;

    /**
     * If set, enforces that the target document must or must not exist.
     */
    readonly exists?: boolean;

}
