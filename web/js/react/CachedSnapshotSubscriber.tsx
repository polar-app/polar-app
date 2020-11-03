import * as React from 'react';
import {SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

export interface CachedSnapshotSubscriberOpts<T> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    readonly subscriber: SnapshotSubscriber<T>;

}

/**
 * Uses LocalStorage to cache the result form snapshots and unsubscribe from them when
 * we're done.
 *
 * This will only work with objects that can be serialized to JSON and should probably
 * only be done with smaller objects.
 */
export function useCachedSnapshotSubscriber<T>(opts: CachedSnapshotSubscriberOpts<T>) {

    const cacheKey = React.useMemo(() => 'cache:' + opts.id, [opts.id]);

    const readCacheData = React.useCallback((): T | undefined => {

        const value = localStorage.getItem(cacheKey)

        if (value === null) {
            return undefined;
        }

        return JSON.parse(value);

    }, [cacheKey]);

    const writeCacheData = React.useCallback((value: T | undefined) => {

        if (value === undefined) {
            localStorage.removeItem(cacheKey);
        } else {
            localStorage.setItem(cacheKey, JSON.stringify(value))
        }

    }, [cacheKey]);

    const initialValue = React.useMemo(readCacheData, [readCacheData]);
    const [value, setValue] = React.useState(initialValue);

    const unsubscriberRef = React.useRef<SnapshotUnsubscriber>();

    const onNext = React.useCallback((value: T | undefined) => {
        writeCacheData(value);
        setValue(value);
    }, [writeCacheData]);

    useComponentDidMount(() => {
        unsubscriberRef.current = opts.subscriber(onNext, () => setValue(undefined))
    });

    useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });

    return value;

}