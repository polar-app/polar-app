// benchmark firebase datastore access...
import {Firebase} from './firestore-user';

/*
  TODO

   - remove my credentials so I can share this code
   - multiple indexed values
   - implement GETs too...

 */


const collection = 'firebench';

const nrKeys = 50;

const timings: Timings = {
    set: [],
    get: []
};


async function benchmark(delegate: () => Promise<any>,
                         timer: (duration: number) => void) {

    const before = Date.now();
    await delegate();
    const after = Date.now();
    const duration = after - before;

    timer(duration);

}

async function doBench() {

    const firestore = await Firebase.getFirestore();

    console.log("Running benchmark...");

    for (let i = 0; i < nrKeys; ++i) {
        console.log(".");
        const key = `${i}`;

        const ref = firestore.collection(collection).doc(key);

        await benchmark(async () => await ref.set({}), duration => timings.set.push(duration));

    }

    for (let i = 0; i < nrKeys; ++i) {
        console.log(".");
        const key = `${i}`;

        const ref = firestore.collection(collection).doc(key);

        await benchmark(async () => await ref.get(), duration => timings.get.push(duration));

    }

    console.log("Running benchmark...done");

    console.log("set stats:");
    console.log(Maths.stats(timings.set));
    console.log("get stats:");
    console.log(Maths.stats(timings.get));

}

doBench()
    .catch(err => console.error("Failed to benchmark: ", err));

interface Timings {
    set: number[]
    get: number[]
}

class Maths {

    public static stats(values: readonly number[]): Stats {

        // compute min/max/mean 90 and 95th percentile.
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = this.mean(values);

        // total duration
        const duration = this.sum(values);
        const percentile90 = this.percentile(90, values);
        const percentile95 = this.percentile(95, values);

        return {min, max, mean, duration, percentile90, percentile95};

    }

    public static percentile(percentile: number,
                             values: readonly number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const cutoff = Math.floor((values.length * (percentile / 100)) - 1);

        if (cutoff < 0 || cutoff >= values.length) {
            throw new Error("Invalid cutoff: " + cutoff);
        }

        const ranked = [...values].sort().reverse();

        return ranked[cutoff];

    }

    public static sum(values: readonly number[]) {

        let result: number = 0;

        for (const value of values) {
            result += value;
        }

        return result;

    }

    public static mean(values: readonly number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const sum = Maths.sum(values);

        return sum / values.length;

    }

}

interface Stats {
    readonly min: number;
    readonly max: number;
    readonly mean: number;
    readonly duration: number;
    readonly percentile90: number;
    readonly percentile95: number;
}
