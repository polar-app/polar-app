/**
 * System that just uses the legacy RendererAnalytics until we do away with GA.
 */
import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "../IAnalytics";

export class OnlineAnalytics implements IAnalytics {

    public constructor(private readonly delegate: IAnalytics) {
    }

    public event(evt: IEventArgs) {
        if (navigator.onLine) {
            this.delegate.event(evt);
        }
    }

    public event2(event: string, data?: any): void {
        if (navigator.onLine) {
            this.delegate.event2(event, data);
        }
    }

    public page(event: IPageEvent) {
        if (navigator.onLine) {
            this.delegate.page(event);
        }
    }

    public identify(user: IAnalyticsUser) {
        if (navigator.onLine) {
            this.delegate.identify(user);
        }
    }

    public traits(map: TraitsMap) {
        if (navigator.onLine) {
            this.delegate.traits(map);
        }
    }

    public version(version: string): void {
        if (navigator.onLine) {
            this.delegate.version(version);
        }
    }

    public heartbeat(): void {
        if (navigator.onLine) {
            this.delegate.heartbeat();
        }
    }

    public logout(): void {
        if (navigator.onLine) {
            this.delegate.logout();
        }
    }

}
