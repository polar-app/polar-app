import {Stopwatch} from './Stopwatch';

export class Stopwatches {

    public static create() {
        return new Stopwatch(Date.now());
    }

}
