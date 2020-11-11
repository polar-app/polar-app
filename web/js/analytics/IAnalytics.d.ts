export interface IAnalytics {
    event(event: IEventArgs): void;
    event2(event: string, data?: any): void;
    page(name: string): void;
    identify(userId: UserIdentificationStr): void;
    traits(traits: TraitsMap): void;
    version(version: string): void;
    heartbeat(): void;
}
export declare type UserIdentificationStr = string;
export interface TraitsMap {
    [key: string]: string | number;
}
export interface IEventArgs {
    category: string;
    action: string;
}
