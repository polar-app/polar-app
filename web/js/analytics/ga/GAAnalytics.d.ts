import { IAnalytics, IEventArgs, TraitsMap, UserIdentificationStr } from "../IAnalytics";
export declare class GAAnalytics implements IAnalytics {
    event(evt: IEventArgs): void;
    event2(event: string, data?: any): void;
    page(name: string): void;
    identify(userId: UserIdentificationStr): void;
    traits(map: TraitsMap): void;
    version(version: string): void;
    heartbeat(): void;
}
