import * as React from 'react';
import {SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {ISnapshot} from "./CachedSnapshotSubscriberContext";

export interface CachedSnapshotSubscriberOpts<V> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    readonly subscriber: SnapshotSubscriber<ISnapshot<V>>;

    readonly onNext: (value: ISnapshot<V> | undefined) => void;

    readonly onError: (err: Error) => void;

}

export namespace LocalCache {

    export function read<V>(cacheKey: string): ISnapshot<V> | undefined {

        const cacheValue = localStorage.getItem(cacheKey)

        if (cacheValue === null || cacheValue === undefined) {
            return undefined;
        }

        try {

            const value = cacheValue === 'undefined' ? undefined : JSON.parse(cacheValue);

            return {
                exists: true,
                value,
                source: 'cache'
            };

        } catch (e) {
            console.error(`Unable to parse JSON for cached subscriber ${cacheKey}: '${cacheValue}'`, e);
            return undefined;
        }

    }

    export function write<V>(cacheKey: string,
                             snapshot: ISnapshot<V> | undefined) {

        if (snapshot === undefined) {
            localStorage.removeItem(cacheKey);
        } else {
            // note that this can write 'undefined' to the cache as a value and we need to
            // handle that
            localStorage.setItem(cacheKey, JSON.stringify(snapshot.value))
        }

    }

    export function createKey(id: string): string {
        return 'cache:' + id
    }

}

/**
 * Cached snapshot provider that uses write through and then reads future cached
 * values from cache.
 */
export function createLocalCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>) {

    const cacheKey = LocalCache.createKey(opts.id);
    const initialValue = LocalCache.read<V>(cacheKey);

    if (initialValue) {
        opts.onNext(initialValue);
    }

    const onNext = (snapshot: ISnapshot<V> | undefined) => {

        opts.onNext(snapshot);
        LocalCache.write(cacheKey, snapshot);

    }

    return opts.subscriber(onNext, opts.onError);

}


export function useLocalCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>) {

    const cacheKey = React.useMemo(() => LocalCache.createKey(opts.id), [opts.id]);

    const readCacheData = React.useCallback((): ISnapshot<V> | undefined => {
        return LocalCache.read(cacheKey);
    }, [cacheKey]);

    const writeCacheData = React.useCallback((snapshot: ISnapshot<V> | undefined) => {
        LocalCache.write(cacheKey, snapshot);
    }, [cacheKey]);

    const initialValue = React.useMemo(readCacheData, [readCacheData]);

    const unsubscriberRef = React.useRef<SnapshotUnsubscriber>();

    const onNext = React.useCallback((snapshot: ISnapshot<V> | undefined) => {
        writeCacheData(snapshot);
        opts.onNext(snapshot);
    }, [opts, writeCacheData]);

    useComponentDidMount(() => {
        opts.onNext(initialValue);
        unsubscriberRef.current = opts.subscriber(onNext, opts.onError)
    });

    useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });

}