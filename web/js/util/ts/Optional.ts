
export class Optional<T> {

    private readonly value?: T = undefined;

    /**
     * An optional name for this optional which can be used when generating
     * errors.
     */
    public readonly name?: string = undefined;

    constructor(value?: T, name?: string) {
        this.value = value;
        this.name = name;
    }

    map(mapFunction: MapFunction<T>): Optional<T> {

        if (this.value !== undefined) {
            return new Optional(mapFunction(this.value), this.name);
        }

        return new Optional<T>(undefined, this.name);

    };

    filter(filterFunction: FilterFunction<T>): Optional<T> {

        if (this.value !== undefined && filterFunction(this.value)) {
            return new Optional(this.value);
        }

        return new Optional<T>(undefined, this.name);

    }

    get(): T {

        if(this.value === undefined) {
            throw new Error("Value is undefined");
        } else {
            return this.value;
        }

    }

    getOrElse(value: T): T {
        if (this.value !== undefined) {
            return this.value;
        }

        return value;
    };

    static of<T>(value: T, name?: string): Optional<T> {
        return new Optional<T>(value, name);
    };

}

export interface MapFunction<T> {
    (value: T): T;
}

export interface FilterFunction<T> {
    (value?: T): T;
}
