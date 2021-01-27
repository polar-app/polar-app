import {IAnalytics, IEventArgs, IPageEvent, TraitsMap, UserIdentificationStr} from "../IAnalytics";

export class ConsoleAnalytics implements IAnalytics {

    public constructor() {
    }

    public event(evt: IEventArgs) {
        console.log("event: ", evt);
    }

    public event2(event: string, data?: any): void {
        console.log("event2: ", event, data);
    }

    public page(event: IPageEvent) {
        // noop
    }

    public identify(userId: UserIdentificationStr) {
        // noop
    }

    public traits(map: TraitsMap) {
        // noop
    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

}
