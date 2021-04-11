import {OnNextCallback, SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import { ISnapshot } from "../../../../web/js/snapshots/CachedSnapshotSubscriberContext";

export function createMockSnapshotSubscriber(): SnapshotSubscriber<ISnapshot<number>> {

    let terminated: boolean = false;
    let iter = 0;

    const unsubscriber: SnapshotUnsubscriber = () => {
        terminated = true;
    }

    const subscriber: SnapshotSubscriber<ISnapshot<number>> = (onNext: OnNextCallback<ISnapshot<number>>, onError) => {

        if (! onNext) {
            throw new Error("No onNext function");
        }

        if (terminated) {
            return unsubscriber;
        }

        if (iter > 0) {
            onNext({
                value: iter,
                exists: true,
                source: 'server'
            });
        }

        ++iter;

        setTimeout(() => subscriber(onNext, onError), 1000);

        return unsubscriber;

    }

    return subscriber;

}