import { IAnalytics, IEventArgs, TraitsMap } from "../IAnalytics";
export declare class NullAnalytics implements IAnalytics {
    event(event: IEventArgs): void;
    event2(event: string, data?: any): void;
    identify(userId: string): void;
    page(name: string): void;
    traits(map: TraitsMap): void;
    version(version: string): void;
    heartbeat(): void;
}
