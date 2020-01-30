
export interface IAnalytics {
    event(event: IEventArgs): void;
    event2(event: string, data?: any): void;
    page(name: string): void;
    identify(userId: UserIdentificationStr): void;
    traits(traits: TraitsMap): void;
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
