import {OnNextCallback, SnapshotSubscriber, SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import { ISnapshot } from "./CachedSnapshot";

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

        onNext({
            value: iter,
            exists: true,
            source: 'server'
        });

        ++iter;

        setTimeout(() => subscriber(onNext, onError), 1000);

        return unsubscriber;

    }

    return subscriber;

}