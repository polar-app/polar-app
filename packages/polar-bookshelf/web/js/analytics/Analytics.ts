import React from 'react';
import {CompositeAnalytics} from "./CompositeAnalytics";
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";
import {AmplitudeAnalytics} from "./amplitude/AmplitudeAnalytics";
import {FirestoreAnalytics} from "./firestore/FirestoreAnalytics";
import {OnlineAnalytics} from "./online/OnlineAnalytics";
import {UserflowAnalytics} from "./userflow/UserflowAnalytics";
import { ConsoleAnalytics } from "./console/ConsoleAnalytics";
import {useIntercomAnalytics} from "./intercom/IntercomAnalytics";

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

    const intercomAnalytics = useIntercomAnalytics();

    return React.useMemo((): IAnalytics => {
        if (isBrowser()) {
            return new OnlineAnalytics(
                new CompositeAnalytics([
                    new AmplitudeAnalytics(),
                    new GAAnalytics(),
                    new FirestoreAnalytics(),
                    new UserflowAnalytics(),
                    new ConsoleAnalytics(),
                    intercomAnalytics,
                ])
            );
        } else {
            return new NullAnalytics();
        }

    }, [intercomAnalytics]);

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
