import {Latch} from '../util/Latch';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreConsistency} from './Datastore';

export class DatastoreMutations {

    private readonly consistency: DatastoreConsistency;

    private constructor(consistency: DatastoreConsistency) {
        this.consistency = consistency;
    }

    public static create(consistency: DatastoreConsistency): DatastoreMutations {
        return new DatastoreMutations(consistency);
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
     */
    public async executeBatchedWrite<T>(datastoreMutation: DatastoreMutation<T>,
                                        remoteSync: (remoteMutations: DatastoreMutation<T>) => Promise<void>,
                                        localSync: (localMutations: DatastoreMutation<T>) => Promise<void>,
                                        remoteMutations: DatastoreMutation<T> = new DefaultDatastoreMutation(),
                                        localMutations: DatastoreMutation<T> = new DefaultDatastoreMutation()): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            remoteSync(remoteMutations)
                .catch((err) => reject(err));

            Promise.race([remoteMutations.written.get(),
                          remoteMutations.committed.get()])
                .then(() => {

                    console.log("FIXME: doing the local now");
                    localSync(localMutations)
                        .catch(err => reject(err));

                })
                .catch((err) => reject(err));

            this.batched(remoteMutations, localMutations, datastoreMutation);

            if (this.consistency === 'committed') {

                console.log("FIXME: going to wait for committed");

                // only return once the remote and local promises / operations
                // have been completed...

                datastoreMutation.committed.get()
                    .then(() => resolve())
                    .catch((err) => reject(err));

            } else {

                console.log("FIXME: goign to wiat for written");

                datastoreMutation.written.get()
                    .then(() => resolve())
                    .catch((err) => reject(err));

            }

        });

    }


    public batched<T>(remoteMutations: DatastoreMutation<T>,
                      localMutations: DatastoreMutation<T>,
                      target: DatastoreMutation<T> ) {

        console.log("FIXME creating batched");

        remoteMutations.written.get().then(() => console.log("FIXME666.2: resolved"));
        localMutations.written.get().then(() => console.log("FIXME777.2: resolved"));


        this.batchPromises(remoteMutations.written.get(), localMutations.written.get(), target.written, 'written');

        if (this.consistency === 'committed') {
            this.batchPromises(remoteMutations.committed.get(), localMutations.committed.get(), target.committed, 'committed');
        }

    }

    /**
     *
     * @param remotePromise
     * @param localPromise
     * @param latch
     * @param consistency The consistency this represents.
     */
    private batchPromises<T>(remotePromise: Promise<T>,
                             localPromise: Promise<T>,
                             latch: Latch<T>,
                             consistency: DatastoreConsistency): void {

        remotePromise.then(() => console.log("FIXME666.3: remotePromise resolved"));
        localPromise.then(() => console.log("FIXME777.3: localPromise resolved"));

        const batch = Promise.all([remotePromise, localPromise]);

        console.log("FIXME created batch promises for:  " + consistency);

        batch.then((result) => {
            console.log("FIXME: batch resolved at consistency: " + consistency);
            latch.resolve(result[0]);
        }).catch(err => {
            console.log("FIXME: batch rejected at consistency: " + consistency);
            latch.reject(err);
        });

    }

    public handle<V, T>(promise: Promise<V>,
                        target: DatastoreMutation<T>,
                        converter: (input: V) => T): void {

        promise.then((result) => {

            try {

                console.log("FIXME: DatastoreMutation has been resolved");
                target.written.resolve(converter(result));
                target.committed.resolve(converter(result));

            } catch (err) {
                console.error("Unable to resolve: ", err);
            }

        }).catch(err => {

            try {
                console.log("FIXME: DatastoreMutation has been rejected");

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
    public pipe<T, V>(source: DatastoreMutation<T>,
                      target: DatastoreMutation<V>,
                      converter: (input: T) => V): void {

        this.pipeLatch(source.written, target.written, converter);
        this.pipeLatch(source.committed, target.committed, converter);

    }

    private pipeLatch<T, V>(source: Latch<T>,
                            target: Latch<V>,
                            converter: (input: T) => V): void {

        source.get()
            .then((value: T) => target.resolve(converter(value)))
            .catch(err => target.reject(err));

    }

}
