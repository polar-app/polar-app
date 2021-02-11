import {AsyncProvider} from "polar-shared/src/util/Providers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Logger} from "polar-shared/src/logger/Logger";
import {
    OnErrorCallback,
    OnNextCallback,
    SnapshotSubscriber,
    SnapshotUnsubscriber
} from "polar-shared/src/util/Snapshots";

const log = Logger.create();

export class SnapshotSubscribers {

    public static createFromAsyncProvider<T>(provider: AsyncProvider<T>): SnapshotSubscriber<T> {

        return (onNext: OnNextCallback<T>, onError?: OnErrorCallback): SnapshotUnsubscriber => {

            const handler = async () => {

                try {

                    const result = await provider();
                    onNext(result);

                } catch (e) {

                    if (onError) {
                        onError(e);
                    }

                }

            };

            handler()
                .catch(err => log.error("Could not create snapshot subscriber: ", err));

            // this is a fire once operation..
            return NULL_FUNCTION;

        };

    }

}
