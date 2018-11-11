import {Latch} from '../util/Latch';
import {DatastoreMutation} from './DatastoreMutation';

export class DatastoreMutations {

    public static batched<T>(dm0: DatastoreMutation<T>, dm1: DatastoreMutation<T>, target: DatastoreMutation<T> ) {

        this.batchPromises(dm0.written.get(), dm1.written.get(), target.written);
        this.batchPromises(dm0.committed.get(), dm1.committed.get(), target.committed);

    }

    private static batchPromises<T>(promise0: Promise<T>, promise1: Promise<T>, latch: Latch<T>): void {

        const batch = Promise.all([promise0, promise1]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }


    /**
     * Perform a write while coordinating the remote and local writes.
     *
     * The remote operation executes and completes written once it's written
     * locally but potentially still unsafe as it's not committed.  Once it's
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
    public static async executeBatchedWrite<T>(remoteCoordinator: DatastoreMutation<T>,
                                               localCoordinator: DatastoreMutation<T>,
                                               datastoreMutation: DatastoreMutation<T>,
                                               remoteSync: () => Promise<void>,
                                               localSync: () => Promise<void>) {

        remoteSync();

        remoteCoordinator.written.get()
            .then(() => {
                localSync();
            });

        DatastoreMutations.batched(remoteCoordinator, localCoordinator, datastoreMutation);

        // only return once the remote and local promises / operations have
        // been completed...

        await datastoreMutation.committed.get();

    }

}
