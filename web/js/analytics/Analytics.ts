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

export namespace Analytics {

    export function event(event: IEventArgs): void {
        delegate.event(event);
    }

    export function event2(event: string, data?: any): void {
        delegate.event2(event, data);
    }

    export function identify(userId: string): void {
        delegate.identify(userId);
    }

    export function page(name: string): void {
        delegate.page(name);
    }

    export function traits(map: TraitsMap): void {
        delegate.traits(map);
    }

    export function version(version: string): void {
        delegate.version(version);
    }

    export function heartbeat(): void {
        delegate.heartbeat();
    }

    /**
     * Action handler for the given delegate.
     */
    export function withEvent(event: IEventArgs) {

        return (delegate: () => void) => {
            Analytics.event(event);
            delegate();
        }

    }

}
