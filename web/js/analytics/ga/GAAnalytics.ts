/**
 * System that just uses the legacy RendererAnalytics until we do away with GA.
 */
import {IEventArgs, TraitsMap, UserIdentificationStr} from "../IAnalytics";
import {RendererAnalytics} from "../../ga/RendererAnalytics";

export class GAAnalytics {

    public event(evt: IEventArgs) {
        RendererAnalytics.event(evt);
    }

    public page(name: string) {
        RendererAnalytics.pageview(name);
    }

    public identify(userId: UserIdentificationStr) {
        // not implemented
    }

    public traits(map: TraitsMap) {
        // not implemented
    }

}
