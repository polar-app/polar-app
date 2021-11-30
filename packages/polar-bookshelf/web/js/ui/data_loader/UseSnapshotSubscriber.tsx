import React from 'react';
import {useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";
import {
    OnErrorCallback,
    OnNextCallback,
    SnapshotSubscriberWithID,
    SnapshotUnsubscriber
} from 'polar-shared/src/util/Snapshots';
import {IDStr} from "polar-shared/src/util/Strings";
import {isPresent} from "polar-shared/src/Preconditions";

export type ErrorType = unknown;

export interface SubscriptionValue<T> {
    // FIXME: add exists
    readonly value: T | undefined;
    readonly error: ErrorType | undefined;
}

export function useSnapshotSubscriberUsingCallbacks<T>(subscriber: SnapshotSubscriberWithID<T>,
                                                       onNext: OnNextCallback<T>,
                                                       onError?: OnErrorCallback) {

    const subscriberIDRef = React.useRef<IDStr>(subscriber.id);
    const unsubscriberRef = React.useRef<SnapshotUnsubscriber | undefined>(undefined);

    if (unsubscriberRef.current && subscriberIDRef.current !== subscriber.id) {
        // we've been called again but there's an existing unsubscriber so
        // we have to unsubscribe, then resubscribe.

        unsubscriberRef.current();
        unsubscriberRef.current = undefined;

    }

    if (! unsubscriberRef.current) {

        const unsubscriber = subscriber.subscribe(onNext, onError);

        if ( ! isPresent(unsubscriber)) {
            console.warn("No unsubscriber");
        }

        unsubscriberRef.current = unsubscriber;

    }

    useComponentWillUnmount(() => {

        if (unsubscriberRef.current) {
            // we're unmounting and we need to unsubscribe to snapshots
            unsubscriberRef.current();
        }

    })

}


// TODO: I don't know if I like this because the subscription returns undefined
// if the remote value is removed but we don't have a dedicated type so we're
// unable to determine if the value was DELETED or just pending a read.  I think
// we have to fix this by having exists: true / false.
/**
 * @NotStale I might end up using this in the future.
 */
export function useSnapshotSubscriber<T>(subscriber: SnapshotSubscriberWithID<T>): SubscriptionValue<T> {

    const [state, setState] = React.useState<SubscriptionValue<T>>({
        value: undefined,
        error: undefined
    });

    const created = React.useMemo(() => Date.now(), []);

    const hasRecordedInitialLatency = React.useRef(false);

    function onNext(value: T | undefined) {

        if (! hasRecordedInitialLatency.current) {
            const lag = Date.now() - created;
            if (lag > 100) {
                console.warn(`Snapshot subscriber has high latency: id=${subscriber.id}, lag=${lag}ms`)
            }
        }

        setState({value, error: undefined});
    }

    function onError(error: unknown) {
        setState({value: undefined, error});
    }

    useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError);

    return state;

}
