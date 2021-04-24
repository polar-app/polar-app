import {IAnalytics, IEventArgs, TraitsMap, UserIdentificationStr, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import {RendererAnalytics} from "../../ga/RendererAnalytics";

/**
 * System that just uses the legacy RendererAnalytics until we do away with GA.
 */
export class GAAnalytics implements IAnalytics {

    public event(evt: IEventArgs) {
        if (navigator.onLine) {
            RendererAnalytics.event(evt);
        }
    }

    public event2(event: string, data?: any): void {
        if (navigator.onLine) {
            RendererAnalytics.event({category: 'misc', action: 'event'});
        }
    }

    public page(event: IPageEvent) {
        if (navigator.onLine) {
            RendererAnalytics.pageview(event.locationCanonicalized);
        }
    }

    public identify(user: IAnalyticsUser) {
        // not implemented
    }

    public traits(map: TraitsMap) {
        // not implemented
    }

    public version(version: string): void {
        // not implemented
    }

    public heartbeat(): void {
        // not implemented
    }

    public logout(): void {
    }

}
