import {URLStr} from "polar-shared/src/util/Strings";

export interface IPageEvent {
    readonly location: string;
    readonly locationCanonicalized: string;
}


export interface IAnalyticsUser {
    readonly uid: string;
    readonly email: string;
    readonly displayName: string | undefined;
    readonly photoURL: URLStr | undefined;
    readonly created: string;
}

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
    page(name: IPageEvent): void;

    /**
     * Identify the user so that duplicate users on different machines are tracked.
     */
    identify(user: IAnalyticsUser): void;

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

    logout(): void;

}

/**
 * A basic and opaque string identifying the user.  Personally identifiable
 * information MUST NOT be stored in this string.  It MUST NOT be shared with
 * other people.
 */
export type UserIdentificationStr = string;

export interface TraitsMap {
    [key: string]: string;
}

export interface IEventArgs {
    category: string;
    action: string;
}

