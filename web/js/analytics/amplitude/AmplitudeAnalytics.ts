import {IAnalytics, IEventArgs, TraitsMap} from "../IAnalytics";

import amplitude from 'amplitude-js';

// TODO: when in NPM environment this won't work..
amplitude.getInstance().init("c1374bb8854a0e847c0d85957461b9f0");

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

}


