export namespace RingBuffers {

    /**
     * A delta over the interval [-∞, 0]
     */
    export type RingDelta = number;

    export interface IRingBuffer<T> {
        push: (value: T) => void;
        fetch: (delta: RingDelta) => T | undefined;
        prev: () => T | undefined;
        peek: () => T | undefined;
        size: () => number;
        length: () => number;

        /**
         * Reset the buffer to the default.
         */
        reset: () => void;
        toArray: () => ReadonlyArray<T>;
    }

    /**
     * Needed to hold the underlying value because an array lookup returns null
     * and we need the ability to STORE null.
     */
    interface Holder<T> {
        readonly value: T;
    }

    /**
     * RingBuffer that allows us to store a stream of entries but maintain a
     * fixed memory/size cap.
     */
    export function create<T>(maxLength: number): IRingBuffer<T> {

        let _pointer = 0;
        let _buffer: Holder<T>[] = [];
        let _size: number = 0;

        function push(value: T){
            _pointer = (_pointer + 1) % maxLength;
            _buffer[_pointer] = {value};
            _size = Math.min(_size + 1, maxLength)
        }

        function fetch(delta: RingDelta): T | undefined {

            const tmp = Math.abs((_pointer - delta) % maxLength);

            const holder = _buffer[tmp];

            if (holder !== undefined) {
                return holder.value;
            }

            return undefined;

        }

        function prev(): T | undefined {
            return fetch(-1);
        }

        function peek(): T | undefined {
            return fetch(0);
        }

        function size(): number {
            return _size;
        }

        function length(): number {
            return maxLength;
        }

        function toArray(): ReadonlyArray<T> {

            const result: T[] = [];

            for (let delta = (_size - 1) * -1; delta <= 0; ++delta) {
                result.push(fetch(delta)!);
            }

            return result;

        }

        function reset(): void {
            _pointer = 0;
            _buffer = [];
            _size = 0;
        }

        return {push, fetch, prev, peek, size, length, toArray, reset}

    }

}
