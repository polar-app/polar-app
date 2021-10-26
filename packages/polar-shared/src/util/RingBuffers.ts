/**
 * Implements a fixed capacity ring buffer.
 */
export namespace RingBuffers {

    /**
     * A delta over the interval [-∞, 0]
     */
    export type RingDelta = number;

    export interface IRingBuffer<T> {
        readonly push: (value: T) => void;
        readonly fetch: (delta: RingDelta) => T | undefined;
        readonly prev: () => T | undefined;
        readonly peek: () => T | undefined;
        readonly size: () => number;
        readonly length: () => number;

        /**
         * Reset the buffer to the default.
         */
        readonly reset: () => void;
        readonly toArray: () => ReadonlyArray<T>;
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

        let _buffer: readonly Holder<T>[] = [];

        function push(value: T) {

            if (_buffer.length >= maxLength) {
                _buffer.shift();
            }

            _buffer.push({value});

        }

        function fetch(delta: RingDelta): T | undefined {

            const idx = _buffer.length - 1 + delta;

            if (idx >= 0 && idx < _buffer.length) {

                const holder = _buffer[idx];

                if (holder !== undefined) {
                    return holder.value;
                }

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
            return _buffer.length;
        }

        function length(): number {
            return maxLength;
        }

        function toArray(): ReadonlyArray<T> {
            return _buffer.map(current => current.value);
        }

        function reset(): void {
            _buffer = [];
        }

        return {push, fetch, prev, peek, size, length, toArray, reset}

    }

}
