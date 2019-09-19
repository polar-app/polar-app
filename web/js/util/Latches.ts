import {Latch} from "polar-shared/src/util/Latch";

export class Latches {

    public static resolved<T>(value: T) {
        const latch = new Latch<T>();
        latch.resolve(value);
        return latch;
    }

}
