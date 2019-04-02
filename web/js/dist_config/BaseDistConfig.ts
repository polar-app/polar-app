/**
 * Handles global settings for apps so that we can enable / disable features
 * based on where they are distributed.  The Microsoft and Apple app stores
 * require different settings.
 */
export class BaseDistConfig {

    /**
     * Enable updates but only if the underlying platform supports it.
     */
    public static readonly ENABLE_UPDATES: boolean = true;

    /**
     * Enable purchased but we might have to disable them from time to time
     * on various platforms until we can support their specific requirements.
     */
    public static readonly ENABLE_PURCHASES: boolean = true;

}
