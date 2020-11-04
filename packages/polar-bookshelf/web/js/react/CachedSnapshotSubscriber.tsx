import * as React from 'react';
import {SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {ISnapshot} from "../../../apps/repository/js/persistence_layer/CachedSnapshot";

export interface CachedSnapshotSubscriberOpts<V> {

    /**
     * The cache key used to cache this entry.
     */
    readonly id: string;

    readonly subscriber: SnapshotSubscriber<ISnapshot<V>>;

    readonly onNext: (value: ISnapshot<V> | undefined) => void;

    readonly onError: (err: Error) => void;

}

export namespace CachedSnapshotStore {

    export function read<V>(cacheKey: string): ISnapshot<V> | undefined {

        const cacheValue = localStorage.getItem(cacheKey)

        if (cacheValue === null || cacheValue === undefined) {
            return undefined;
        }

        try {

            const value = JSON.parse(cacheValue)

            return {
                exists: true,
                value,
                source: 'cache'
            };

        } catch (e) {
            console.error("Unable to parse JSON: " + cacheValue, e);
            return undefined;
        }


    }

    export function write<V>(cacheKey: string,
                             snapshot: ISnapshot<V> | undefined) {

        if (snapshot === undefined) {
            // TODO: I don't think this is correct and that we should write
            // undefined to the cache but this is a rare use case.
            localStorage.removeItem(cacheKey);
        } else {
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
export function createCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>) {

    const cacheKey = CachedSnapshotStore.createKey(opts.id);
    const initialValue = CachedSnapshotStore.read<V>(cacheKey);

    if (initialValue) {
        opts.onNext(initialValue);
    }

    const onNext = (snapshot: ISnapshot<V> | undefined) => {

        opts.onNext(snapshot);
        CachedSnapshotStore.write(cacheKey, snapshot);

    }

    return opts.subscriber(onNext, opts.onError);

}


export function useCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>) {

    const cacheKey = React.useMemo(() => CachedSnapshotStore.createKey(opts.id), [opts.id]);

    const readCacheData = React.useCallback((): ISnapshot<V> | undefined => {
        return CachedSnapshotStore.read(cacheKey);
    }, [cacheKey]);

    const writeCacheData = React.useCallback((snapshot: ISnapshot<V> | undefined) => {
        CachedSnapshotStore.write(cacheKey, snapshot);
    }, [cacheKey]);

    const initialValue = React.useMemo(readCacheData, [readCacheData]);

    // const [value, setValue] = React.useState(initialValue);

    opts.onNext(initialValue);

    const unsubscriberRef = React.useRef<SnapshotUnsubscriber>();

    const onNext = React.useCallback((snapshot: ISnapshot<V> | undefined) => {
        writeCacheData(snapshot);
        opts.onNext(snapshot);
    }, [opts, writeCacheData]);

    useComponentDidMount(() => {
        unsubscriberRef.current = opts.subscriber(onNext, opts.onError)
    });

    useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });

}