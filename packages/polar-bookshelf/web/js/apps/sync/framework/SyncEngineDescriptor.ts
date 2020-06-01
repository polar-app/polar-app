/**
 * Provides metadata for a SyncEngine including the name and other data which
 * can be shown to the user.
 *
 */
export interface SyncEngineDescriptor {

    /**
     * A unique ID for this SyncEngine (use a GUID).
     */
    readonly id: string;

    readonly name: string;

    readonly description?: string;

}
