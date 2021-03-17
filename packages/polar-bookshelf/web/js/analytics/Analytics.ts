import React from 'react';
import {CompositeAnalytics} from "./CompositeAnalytics";
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";
import {AmplitudeAnalytics} from "./amplitude/AmplitudeAnalytics";
import {FirestoreAnalytics} from "./firestore/FirestoreAnalytics";
import {OnlineAnalytics} from "./online/OnlineAnalytics";
import {UserflowAnalytics} from "./userflow/UserflowAnalytics";
import { ConsoleAnalytics } from "./console/ConsoleAnalytics";
import {IntercomAnalytics} from "./intercom/IntercomAnalytics";
import {CannyAnalytics} from "./canny/CannyAnalytics";

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
                new IntercomAnalytics(),
                new CannyAnalytics()
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

    return React.useMemo((): IAnalytics => {
        if (isBrowser()) {
            return new OnlineAnalytics(
                new CompositeAnalytics([
                    new AmplitudeAnalytics(),
                    new GAAnalytics(),
                    new FirestoreAnalytics(),
                    new UserflowAnalytics(),
                    new ConsoleAnalytics(),
                    new IntercomAnalytics(),
                    new CannyAnalytics(),
                ])
            );
        } else {
            return new NullAnalytics();
        }

    }, []);

}

export namespace Analytics {

    export function event(event: IEventArgs): void {
        delegate.event(event);
    }

    export function event2(event: string, data?: any): void {
        delegate.event2(event, data);
    }

    export function identify(user: IAnalyticsUser): void {
        delegate.identify(user);
    }

    export function page(event: IPageEvent): void {
        delegate.page(event);
    }

    /**
     * @deprecated We must use useAnalytics here because the modern traits need
     * to use hooks.
     */
    export function traits(map: TraitsMap): void {
        delegate.traits(map);
    }

    export function version(version: string): void {
        delegate.version(version);
    }

    export function heartbeat(): void {
        delegate.heartbeat();
    }

    export function logout(): void {
        delegate.logout();
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
