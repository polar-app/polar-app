import {CompositeAnalytics} from "./CompositeAnalytics";
import {IAnalytics, IEventArgs, TraitsMap} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";
import {AmplitudeAnalytics} from "./amplitude/AmplitudeAnalytics";
import {FirestoreAnalytics} from "./firestore/FirestoreAnalytics";
import {OnlineAnalytics} from "./online/OnlineAnalytics";

export function isBrowser() {
    return typeof window !== 'undefined';
}

function createDelegate(): IAnalytics {

    if (isBrowser()) {
        return new OnlineAnalytics(
            new CompositeAnalytics([
                new AmplitudeAnalytics(),
                new GAAnalytics(),
                new FirestoreAnalytics()
            ])
        );
    } else {
        return new NullAnalytics();
    }

}

const delegate = createDelegate();

export class Analytics {

    public static event(event: IEventArgs): void {
        delegate.event(event);
    }

    public static event2(event: string, data?: any): void {
        delegate.event2(event, data);
    }

    public static identify(userId: string): void {
        delegate.identify(userId);
    }

    public static page(name: string): void {
        delegate.page(name);
    }

    public static traits(map: TraitsMap): void {
        delegate.traits(map);
    }

    public static version(version: string): void {
        delegate.version(version);
    }

    public static heartbeat(): void {
        delegate.heartbeat();
    }

}
