import {ErrorHandlerCallback} from "./Firebase";
import {AsyncProvider} from "polar-shared/src/util/Providers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { Logger } from "polar-shared/src/logger/Logger";

const log = Logger.create();

/**
 * Function who's sole purpose to unsubscribe from snapshots.
 */
export type SnapshotUnsubscriber = () => void;

export interface SnapshotCallback<V> {
    // tslint:disable-next-line:callable-types
    (value: V | undefined): void;
}

export interface SnapshotSubscriber<V> {
    // tslint:disable-next-line:callable-types
    (onNext: SnapshotCallback<V>, onError: ErrorHandlerCallback): SnapshotUnsubscriber;
}

export class SnapshotSubscribers {

    public static createFromAsyncProvider<T>(provider: AsyncProvider<T>): SnapshotSubscriber<T> {

        return (onNext: SnapshotCallback<T>, onError: ErrorHandlerCallback): SnapshotUnsubscriber => {

            const handler = async () => {

                try {

                    const result = await provider();
                    onNext(result);

                } catch (e) {
                    onError(e);
                }

            };

            handler()
                .catch(err => log.error("Could not create snapshot subscriber: ", err));

            // this is a fire once operation..
            return NULL_FUNCTION;

        };

    }

}
