import {IAnalytics, IEventArgs, TraitsMap} from "../IAnalytics";

export class NullAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
    }

    public event2(event: string, data?: any): void {
    }

    public identify(userId: string): void {
    }

    public page(name: string): void {
    }

    public traits(map: TraitsMap): void {
    }

    public version(version: string): void {
    }

    public heartbeat(): void {

    }


}
