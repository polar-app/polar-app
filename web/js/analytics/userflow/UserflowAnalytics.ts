import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import userflow from 'userflow.js'

userflow.init('bmztslyu5zgujmcvna34mggj44');

let userId: string | undefined;

export class UserflowAnalytics implements IAnalytics {


    public event(event: IEventArgs): void {
        // noop
    }

    public event2(event: string, data?: any): void {
        // noop
    }

    public identify(newUserId: string): void {
        userId = newUserId;
    }

    public page(event: IPageEvent): void {
        // noop
    }

    public traits(traits: TraitsMap): void {

        if (userId) {
            userflow.identify(userId, traits);
        } else {
            console.warn("No userId for userflow");
        }

    }

    public version(version: string) {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

}


