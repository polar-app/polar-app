import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import {Analytics} from "../Analytics";
import { StandardEventProperties } from "../StandardEventProperties";

function isBrowser() {
    return typeof window !== 'undefined';
}

function createAmplitude(): any {

    if (isBrowser()) {
        const amplitude = require('amplitude-js');

        amplitude.getInstance().init("c1374bb8854a0e847c0d85957461b9f0", null, {
            sameSiteCookie: "Lax",
            domain: ".getpolarized.io",
            includeUtm: true,
            includeReferrer: true,
            saveEvents: true,
        });

        return amplitude;

    }

}


// TODO session variables...

const amplitude = createAmplitude();
const standardEventProperties = StandardEventProperties.create();

export class AmplitudeAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        amplitude.getInstance().logEvent(event.category + '/' + event.action, standardEventProperties);
    }

    public event2(event: string, data?: any): void {
        amplitude.getInstance().logEvent(event, {...data, ...standardEventProperties});
    }

    public identify(userId: string): void {
        amplitude.getInstance().setUserId(userId);
    }

    public page(event: IPageEvent): void {
        amplitude.getInstance().logEvent('pageView', {...event, ...standardEventProperties});
    }

    public traits(traits: TraitsMap): void {
        amplitude.getInstance().setUserProperties(traits);
    }

    // TODO: make this a method
    public version(version: string) {
        amplitude.getInstance().setVersionName(version);
    }

    public heartbeat(): void {
        Analytics.event2('heartbeat');
    }

}


