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

}
