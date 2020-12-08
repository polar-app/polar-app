import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import userflow from 'userflow.js'

userflow.init('ct_kyip2xj7ufhz7a2v7ejnwxaaxa');

// https://getuserflow.com/docs/userflow-js#track

let identified: boolean = false;

export class UserflowAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {

        if (! identified) {
            return;
        }

        userflow.track(event.category + '/' + event.action);
    }

    public event2(event: string, data?: any): void {

        if (! identified) {
            return;
        }

        userflow.track(event, data)
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


