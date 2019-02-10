/**
 * Handles global settings for apps so that we can enable / disable features
 * based on where they are distributed.  The Microsoft and Apple app stores
 * require different settings.
 */
export class AppConfig {

    public static readonly ENABLE_UPDATES: boolean = true;

}
