
export interface IAnalytics {
    event(event: IEventArgs): void;
    page(name: string): void;
    identify(userId: UserIdentificationStr): void;
    traits(map: TraitsMap): void;
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
