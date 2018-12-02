import {Latch} from '../util/Latch';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';

export class DatastoreMutations {

    public static batched<T>(dm0: DatastoreMutation<T>, dm1: DatastoreMutation<T>, target: DatastoreMutation<T> ) {

        this.batchPromises(dm0.written.get(), dm1.written.get(), target.written);
        this.batchPromises(dm0.committed.get(), dm1.committed.get(), target.committed);

    }

    public static handle<V, T>(promise: Promise<V>, target: DatastoreMutation<T>, converter: (input: V) => T): void {

        promise.then((result) => {

            try {

                target.written.resolve(converter(result));
                target.committed.resolve(converter(result));

            } catch (err) {
                console.error("Unable to resolve: ", err);
            }

        }).catch(err => {

            try {

                target.written.reject(err);
                target.committed.reject(err);

            } catch (err) {
                console.error("Unable to reject: ", err);
            }

        });

    }

    /**
     * Pipe the resolve and reject status of the latches to the target.
     */
    public static pipe<T, V>(source: DatastoreMutation<T>,
                             target: DatastoreMutation<V>,
                             converter: (input: T) => V): void {

        this.pipeLatch(source.written, target.written, converter);
        this.pipeLatch(source.committed, target.committed, converter);

    }

    /**
     * Perform a write while coordinating the remote and local writes.
     *
     * The remote operation executes and completes written once it's written
     * locally but potentially still unsafe as it's not 'committed'.  Once it's
     * committed locally (and safe) then we can perform the local operation
     * which is also atomic (and safe).
     *
     * Then we perform BOTH batched operations and make sure they're all both
     * written and committed before returning.
     *
     * The caller DOES NOT need to wait for the promise to complete.  It could
     * put them into queues or just look at the written and committed values
     * on the datastoreMutation as it's moving forward.  This allows us to
     * have a progress bar integrated showing that the sync operations aren't
     * completed yet.
     *
     * @param remoteCoordinator
     * @param localCoordinator
     * @param datastoreMutation
     * @param remoteSync
     * @param localSync
     */
    public static async executeBatchedWrite<T>(datastoreMutation: DatastoreMutation<T>,
                                               remoteSync: (remoteCoordinator: DatastoreMutation<T>) => Promise<void>,
                                               localSync: (localCoordinator: DatastoreMutation<T>) => Promise<void>,
                                               remoteCoordinator: DatastoreMutation<T> = new DefaultDatastoreMutation(),
                                               localCoordinator: DatastoreMutation<T> = new DefaultDatastoreMutation()): Promise<void> {

        // FIXME: both of these are broken as we're not actually catching
        // exceptions here and when we do how do we reject them?

        return new Promise<void>((resolve, reject) => {

            remoteSync(remoteCoordinator)
                .catch((err) => reject(err));

            remoteCoordinator.written.get()
                .then(() => {

                    localSync(localCoordinator)
                        .catch(err => reject(err));

                })
                .catch((err) => reject(err));

            DatastoreMutations.batched(remoteCoordinator, localCoordinator, datastoreMutation);

            // only return once the remote and local promises / operations have
            // been completed...

            datastoreMutation.committed.get()
                .then(() => resolve())
                .catch((err) => reject(err));

        });

    }


    private static pipeLatch<T, V>(source: Latch<T>,
                                   target: Latch<V>,
                                   converter: (input: T) => V): void {

        source.get()
            .then((value: T) => target.resolve(converter(value)))
            .catch(err => target.reject(err));

    }

    private static batchPromises<T>(promise0: Promise<T>, promise1: Promise<T>, latch: Latch<T>): void {

        const batch = Promise.all([promise0, promise1]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }

}
