import {IAnalytics, IEventArgs, TraitsMap} from "../IAnalytics";
import {Analytics} from "../Analytics";

function isBrowser() {
    return typeof window !== 'undefined';
}

function createAmplitude(): any {

    if (isBrowser()) {
        const amplitude = require('amplitude-js');
        amplitude.getInstance().init("c1374bb8854a0e847c0d85957461b9f0", null, {
            includeUtm: true,
            includeReferrer: true,
            saveEvents: true,
        });
        return amplitude;
    }

}

// TODO session variables...

const amplitude = createAmplitude();

export class AmplitudeAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        amplitude.getInstance().logEvent(event.category + '/' + event.action);
    }

    public event2(event: string, data?: any): void {
        // TODO: amplitude supports extended event properties.
        amplitude.getInstance().logEvent(event, data);
    }

    public identify(userId: string): void {
        amplitude.getInstance().setUserId(userId);
    }

    public page(name: string): void {
        amplitude.getInstance().logEvent('page:' + name);
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


