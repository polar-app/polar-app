import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "../IAnalytics";

export class NullAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        // noop
    }

    public event2(event: string, data?: any): void {
        // noop
    }

    public identify(user: IAnalyticsUser): void {
        // noop
    }

    public page(event: IPageEvent): void {
        // noop
    }

    public traits(map: TraitsMap): void {
        // noop
    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
        // noop
    }

}
