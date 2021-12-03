import React from 'react';
import {CompositeAnalytics} from "./CompositeAnalytics";
import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "./IAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";
import {AmplitudeAnalytics} from "./amplitude/AmplitudeAnalytics";
import {FirestoreAnalytics} from "./firestore/FirestoreAnalytics";
import {OnlineAnalytics} from "./online/OnlineAnalytics";
import {ConsoleAnalytics} from "./console/ConsoleAnalytics";
import {CannyAnalytics} from "./canny/CannyAnalytics";
import {SentryAnalytics} from "./sentry/SentryAnalytics";
import {useRefValue} from "../hooks/ReactHooks";

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
        // webExtension ? undefined : new GAAnalytics(),
        webExtension ? undefined : new FirestoreAnalytics(),
        new ConsoleAnalytics(),
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

type TaskEventReporterData = Readonly<{
    [key: string]: string | number;
}>;

/**
 * A task event reporter gives us a way to report success/failure for a given named operation.
 */
export function useTaskEventReporter(eventName: string, data: TaskEventReporterData = {}) {

    const analytics = useAnalytics();
    const analyticsRef = useRefValue(analytics);

    return React.useCallback((status: 'pass' | 'fail') => {
        analyticsRef.current.event2(eventName, {...data, status});
    }, [analyticsRef, data, eventName]);

}

/**
 * Run an async task and record pass/fail
 */
export function useTaskEventReporterHandler(eventName: string, data: TaskEventReporterData = {}) {

    const taskEventReporter = useTaskEventReporter(eventName, data);

    return React.useCallback(async (task: () => Promise<void>) => {

        try {
            await task();
            taskEventReporter('pass');
        } catch (e) {
            taskEventReporter('fail');
            throw e;
        }


    }, [taskEventReporter]);

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

