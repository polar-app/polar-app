import {IAnalytics, IEventArgs, TraitsMap, UserIdentificationStr, IPageEvent} from "../IAnalytics";
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
        // noop
    }

    public page(event: IPageEvent) {
        if (navigator.onLine) {
            RendererAnalytics.pageview(event.locationCanonicalized);
        }
    }

    public identify(userId: UserIdentificationStr) {
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

}
