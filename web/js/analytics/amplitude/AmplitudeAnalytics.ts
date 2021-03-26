import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
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

const TRACING_ENABLED = typeof localStorage !== 'undefined' &&
                        localStorage.getItem('amplitude.tracing') === 'true';

// TODO session variables...

const amplitude = createAmplitude();
const standardEventProperties = StandardEventProperties.create();

function doTrace(eventName: string, eventData: object | undefined) {

    if (TRACING_ENABLED) {
        console.log("amplitude: " + eventName, eventData || {});
    }

}

export class AmplitudeAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {

        const eventName = event.category + '/' + event.action;
        const eventData = standardEventProperties;

        doTrace(eventName, eventData);
        amplitude.getInstance().logEvent(eventName, eventData);

    }

    public event2(eventName: string, data?: any): void {

        const eventData = {...data, ...standardEventProperties};

        doTrace(eventName, eventData);
        amplitude.getInstance().logEvent(eventName, eventData);
    }

    public identify(user: IAnalyticsUser): void {
        doTrace('identify', user);
        amplitude.getInstance().setUserId(user.uid);
    }

    public page(event: IPageEvent): void {

        const eventName = 'pageView';
        const eventData = {...event, ...standardEventProperties};

        doTrace(eventName, eventData);
        amplitude.getInstance().logEvent(eventName, eventData);

    }

    public traits(traits: TraitsMap): void {
        doTrace('traits', traits);
        amplitude.getInstance().setUserProperties(traits);
    }

    // TODO: make this a method
    public version(version: string) {
        amplitude.getInstance().setVersionName(version);
    }

    public heartbeat(): void {
        Analytics.event2('heartbeat');
    }

    public logout(): void {
    }

}




