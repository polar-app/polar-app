
export interface IAnalytics {

    /**
     * Older style GA event with category and action.
     */
    event(event: IEventArgs): void;

    /**
     * An event with an arbitrary data payload with key/value pairs.
     */
    event2(event: string, data?: any): void;

    /**
     * A page has been loaded
     *
     * @param name The name/path of the page
     */
    page(name: string): void;

    /**
     * Identify the user so that duplicate users on different machines are tracked.
     */
    identify(userId: UserIdentificationStr): void;

    /**
     * Set user traits.
     */
    traits(traits: TraitsMap): void;

    /**
     * Set the app version
     */
    version(version: string): void;

    /**
     * The user has has loaded the app nad we should record a heartbeat so that
     * we can track app usage.
     */
    heartbeat(): void;

}

/**
 * A basic and opaque string identifying the user.  Personally identifiable
 * information MUST NOT be stored in this string.  It MUST NOT be shared with
 * other people.
 */
export type UserIdentificationStr = string;

export interface TraitsMap {
    [key: string]: string | number;
}

export interface IEventArgs {
    category: string;
    action: string;
}
