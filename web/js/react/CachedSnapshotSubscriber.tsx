import * as React from 'react';
import {SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

export interface CachedSnapshotSubscriberOpts<T> {

    /**
     * The cache key used to cache this entry.
     */
    readonly key: string;

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

    const readCacheData = React.useCallback((): T | undefined => {

        const value = localStorage.getItem(opts.key)

        if (value === null) {
            return undefined;
        }

        return JSON.parse(value);

    }, [opts.key]);

    const writeCacheData = React.useCallback((value: T | undefined) => {

        if (value === undefined) {
            localStorage.removeItem(opts.key);
        } else {
            localStorage.setItem(opts.key, JSON.stringify(value))
        }

    }, [opts.key]);


    const initialValue = React.useMemo(readCacheData, [readCacheData]);
    const [value, setValue] = React.useState(initialValue);

    const unsubscriberRef = React.useRef<SnapshotUnsubscriber>();

    const onNext = React.useCallback((value: T | undefined) => {
        writeCacheData(value);
        setValue(value);
    }, [writeCacheData]);

    React.useEffect(() => {
        unsubscriberRef.current = opts.subscriber(onNext, () => setValue(undefined))
    }, [onNext, opts]);

    useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });

    return value;

}