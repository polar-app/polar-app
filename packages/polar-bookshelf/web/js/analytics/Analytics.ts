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
import {SentryAnalytics} from "./sentry/SentryAnalytics";

export function isBrowser() {
    return typeof window !== 'undefined';
}

export function isWebExtension() {
    return document.location.href.startsWith("chrome-extension:");
}

function createDelegates(): ReadonlyArray<IAnalytics> {

    const webExtension = isWebExtension();

    return [
        new AmplitudeAnalytics(),
        webExtension ? undefined : new GAAnalytics(),
        webExtension ? undefined : new FirestoreAnalytics(),
        webExtension ? undefined : new UserflowAnalytics(),
        new ConsoleAnalytics(),
        webExtension ? undefined : new IntercomAnalytics(),
        webExtension ? undefined : new CannyAnalytics(),
        new SentryAnalytics()
    ].filter(current => current !== undefined)
     .map(current => current!);
}

function createInstance(): IAnalytics {

    if (isBrowser()) {
        return new OnlineAnalytics(
            new CompositeAnalytics(createDelegates())
        );
    } else {
        return new NullAnalytics();
    }

}

const instance = createInstance();

/**
 * Hook for analytics that isn't that complicated yet but we can add more
 * functionality later.
 */
export function useAnalytics(): IAnalytics {

    return React.useMemo((): IAnalytics => {
        if (isBrowser()) {
            return new OnlineAnalytics(
                new CompositeAnalytics(createDelegates())
            );
        } else {
            return new NullAnalytics();
        }

    }, []);

}

export namespace Analytics {

    export function event(event: IEventArgs): void {
        instance.event(event);
    }

    export function event2(event: string, data?: any): void {
        instance.event2(event, data);
    }

    export function identify(user: IAnalyticsUser): void {
        instance.identify(user);
    }

    export function page(event: IPageEvent): void {
        instance.page(event);
    }

    /**
     * @deprecated We must use useAnalytics here because the modern traits need
     * to use hooks.
     */
    export function traits(map: TraitsMap): void {
        instance.traits(map);
    }

    export function version(version: string): void {
        instance.version(version);
    }

    export function heartbeat(): void {
        instance.heartbeat();
    }

    export function logout(): void {
        instance.logout();
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
