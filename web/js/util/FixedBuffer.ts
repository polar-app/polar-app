/**
 * Fixed capacity buffer view of the underlying data.
 */
export class FixedBuffer<V> {

    public readonly buffer: V[] = [];

    private readonly capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public write(value: V): void {

        if (this.buffer.length >= this.capacity) {
            this.buffer.splice(0);
        }

        this.buffer.push(value);

    }

    public toView(): ReadonlyArray<V> {
        return this.buffer;
    }

}
