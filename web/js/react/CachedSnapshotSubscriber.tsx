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

export function useCachedSnapshotSubscriber<V>(opts: CachedSnapshotSubscriberOpts<V>) {

    const cacheKey = React.useMemo(() => 'cache:' + opts.id, [opts.id]);

    const readCacheData = React.useCallback((): ISnapshot<V> | undefined => {

        const value = localStorage.getItem(cacheKey)

        if (value === null) {
            return undefined;
        }

        return {
            exists: true,
            value: JSON.parse(value),
            source: 'cache'
        };

    }, [cacheKey]);

    const writeCacheData = React.useCallback((snapshot: ISnapshot<V> | undefined) => {

        if (snapshot === undefined) {
            // TODO: I don't think this is correct and that we should write
            // undefined to the cache but this is a rare use case.
            localStorage.removeItem(cacheKey);
        } else {
            localStorage.setItem(cacheKey, JSON.stringify(snapshot.value))
        }

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