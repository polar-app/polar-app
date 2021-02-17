import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap, UserIdentificationStr} from "../IAnalytics";

const ENABLED = typeof localStorage !== 'undefined' &&
                localStorage.getItem('analytics.tracing') === 'true';

function doTrace(eventName: string, data: object | undefined) {

    if (ENABLED) {
        console.log("analytics: " + eventName, data || {});
    }

}

export class ConsoleAnalytics implements IAnalytics {

    public constructor() {
        // noop
    }

    public event(evt: IEventArgs) {
        doTrace("event", evt);
    }

    public event2(event: string, data?: any): void {
        doTrace("event2:" + event, data || {});
    }

    public page(event: IPageEvent) {
        doTrace("page", event);
    }

    public identify(user: IAnalyticsUser) {
        doTrace("identify", user);

    }

    public traits(traitsMap: TraitsMap) {
        doTrace("traits", traitsMap);
    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
    }

}
