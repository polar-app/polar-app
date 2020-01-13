import analytics from '@segment/analytics.js-core';
import {IEventArgs, TraitsMap, UserIdentificationStr} from "../IAnalytics";

analytics.load("ogIRcN7inQDBxIYySQtDZjBUHepranLX");

export class SegmentAnalytics {

    public event(evt: IEventArgs) {
        const eventName = `${evt.action}/${evt.action}`;
        analytics.track(eventName);
    }

    public page(name: string) {
        analytics.page(name);
    }

    public identify(userId: UserIdentificationStr) {
        analytics.identify(userId);
    }

    public traits(map: TraitsMap) {
        analytics.identify(map);
    }

}
