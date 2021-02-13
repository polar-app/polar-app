import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";

export class IntercomAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {

    }

    public event2(eventName: string, data?: any): void {
    }

    public identify(userId: string): void {
    }

    public page(event: IPageEvent): void {
    }

    public traits(traits: TraitsMap): void {
    }

    public version(version: string) {
    }

    public heartbeat(): void {
    }

}


