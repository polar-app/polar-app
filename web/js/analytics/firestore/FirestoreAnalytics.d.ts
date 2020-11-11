import { IAnalytics, IEventArgs, TraitsMap } from "../IAnalytics";
export declare class FirestoreAnalytics implements IAnalytics {
    event(event: IEventArgs): void;
    event2(event: string, data?: any): void;
    identify(userId: string): void;
    page(name: string): void;
    traits(traits: TraitsMap): void;
    version(version: string): void;
    heartbeat(): void;
}
