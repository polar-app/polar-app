import {CompositeAnalytics} from "./CompositeAnalytics";
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";
import {AmplitudeAnalytics} from "./amplitude/AmplitudeAnalytics";
import {FirestoreAnalytics} from "./firestore/FirestoreAnalytics";
import {OnlineAnalytics} from "./online/OnlineAnalytics";
import {UserflowAnalytics} from "./userflow/UserflowAnalytics";
import { ConsoleAnalytics } from "./console/ConsoleAnalytics";

export function isBrowser() {
    return typeof window !== 'undefined';
}

function createDelegate(): IAnalytics {

    if (isBrowser()) {
        return new OnlineAnalytics(
            new CompositeAnalytics([
                new AmplitudeAnalytics(),
                new GAAnalytics(),
                new FirestoreAnalytics(),
                new UserflowAnalytics(),
                new ConsoleAnalytics(),
            ])
        );
    } else {
        return new NullAnalytics();
    }

}

const delegate = createDelegate();

/**
 * Hook for analytics that isn't that complicated yet but we can add more
 * functionality later.
 */
export function useAnalytics(): IAnalytics {
    return {
        event: Analytics.event,
        event2: Analytics.event2,
        identify: Analytics.identify,
        page: Analytics.page,
        traits: Analytics.traits,
        version: Analytics.version,
        heartbeat: Analytics.heartbeat
    }
}

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

    export function page(event: IPageEvent): void {
        delegate.page(event);
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
