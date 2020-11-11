import { IEventArgs, TraitsMap } from "./IAnalytics";
export declare function isBrowser(): boolean;
export declare class Analytics {
    static event(event: IEventArgs): void;
    static event2(event: string, data?: any): void;
    static identify(userId: string): void;
    static page(name: string): void;
    static traits(map: TraitsMap): void;
    static version(version: string): void;
    static heartbeat(): void;
}
