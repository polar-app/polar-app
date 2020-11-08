/**
 * System that just uses the legacy RendererAnalytics until we do away with GA.
 */
import {IAnalytics, IEventArgs, TraitsMap, UserIdentificationStr} from "../IAnalytics";

export class OnlineAnalytics implements IAnalytics {

    public constructor(private readonly delegate: IAnalytics) {
    }

    public event(evt: IEventArgs) {
        if (navigator.onLine) {
            this.delegate.event(evt);
        }
    }

    public event2(event: string, data?: any): void {
        if (navigator.onLine) {
            this.delegate.event2(event, data);
        }
    }

    public page(name: string) {
        if (navigator.onLine) {
            this.delegate.page(name);
        }
    }

    public identify(userId: UserIdentificationStr) {
        if (navigator.onLine) {
            this.delegate.identify(userId);
        }
    }

    public traits(map: TraitsMap) {
        if (navigator.onLine) {
            this.delegate.traits(map);
        }
    }

    public version(version: string): void {
        if (navigator.onLine) {
            this.delegate.version(version);
        }
    }

    public heartbeat(): void {
        if (navigator.onLine) {
            this.delegate.heartbeat();
        }
    }

}
