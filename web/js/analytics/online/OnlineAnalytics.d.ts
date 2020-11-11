import { IAnalytics, IEventArgs, TraitsMap, UserIdentificationStr } from "../IAnalytics";
export declare class OnlineAnalytics implements IAnalytics {
    private readonly delegate;
    constructor(delegate: IAnalytics);
    event(evt: IEventArgs): void;
    event2(event: string, data?: any): void;
    page(name: string): void;
    identify(userId: UserIdentificationStr): void;
    traits(map: TraitsMap): void;
    version(version: string): void;
    heartbeat(): void;
}
