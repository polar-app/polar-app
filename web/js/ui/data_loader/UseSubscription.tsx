import React from 'react';
import {
    SnapshotSubscriber,
    SnapshotUnsubscriber
} from "../../firebase/SnapshotSubscribers";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";

export interface SubscriptionValue<T> {
    readonly value: T | undefined;
    readonly error: Error | undefined;
}

// TODO: I don't know if I like this because the subcription returns undefined
// if the remote value is removed but we don't have a dedicated type so we're
// unable to determine if the value was DELETED or just pending a read.
export function useSubscription<T>(subscriber: SnapshotSubscriber<T>): SubscriptionValue<T> {

    const [state, setState] = React.useState<SubscriptionValue<T>>({
        value: undefined,
        error: undefined
    });

    const unsubscriber = React.useRef<SnapshotUnsubscriber | undefined>(undefined);

    useComponentDidMount(() => {

        function onNext(value: T | undefined) {
            setState({value, error: undefined});
        }

        function onError(error: Error) {
            setState({value: undefined, error});
        }

        unsubscriber.current = subscriber(onNext, onError)

    })

    useComponentWillUnmount(() => {

        if (unsubscriber.current) {
            unsubscriber.current();
        }

    })

    return state;

}
