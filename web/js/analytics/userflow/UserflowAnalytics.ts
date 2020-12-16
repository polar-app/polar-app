import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import userflow from 'userflow.js'
import { AppRuntime } from "polar-shared/src/util/AppRuntime";

if (! AppRuntime.isNode()) {
    userflow.init('ct_kyip2xj7ufhz7a2v7ejnwxaaxa');
}

// https://getuserflow.com/docs/userflow-js#track

let identified: boolean = false;

export class UserflowAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {

        if (! identified) {
            return;
        }

        const eventName = event.category + '_' + event.action;

        try {
            userflow.track(eventName);
        } catch (e) {
            console.warn("Unable to track userflow event: " + eventName);
        }

    }

    public event2(event: string, data?: any): void {

        if (! identified) {
            return;
        }

        try {
            userflow.track(event, data)
        } catch (e) {
            console.warn("Unable to track userflow event: " + event);
        }

    }

    public identify(userId: string): void {
        userflow.identify(userId);
        identified = true;
    }

    public page(event: IPageEvent): void {
        // noop
    }

    public traits(traits: TraitsMap): void {
        userflow.updateUser(traits);
    }

    public version(version: string) {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

}


