
export class Optional<T> {

    private readonly value?: T = undefined;

    /**
     * An name for this Optional which can be used when generating errors.
     */
    public readonly name?: string = undefined;

    constructor(value?: T, name?: string) {
        this.value = value;
        this.name = name;
    }

    map(mapFunction: MapFunction<NonNullable<T>>): Optional<any> {

        if (this.isPresent()) {
            return new Optional(mapFunction(this.value!), this.name);
        }

        return new Optional<T>(undefined, this.name);

    }

    when(consumeFunction: ConsumeFunction<NonNullable<T>>) {

        if (this.isPresent()) {
            consumeFunction(this.value!);
        }

    }

    filter(filterFunction: FilterFunction<NonNullable<T>>): Optional<T> {

        if (this.isPresent() && filterFunction(this.value!)) {
            return new Optional(this.value);
        }

        return new Optional<T>(undefined, this.name);

    }

    get(): NonNullable<T> {

        if(this.isPresent()) {
            return this.value!;
        } else {
            throw new Error("The value is undefined");
        }

    }

    getOrElse(value: NonNullable<T>): NonNullable<T> {

        if (this.isPresent()) {
            return this.value!;
        }

        return value;
    }

    /**
     * Get the value or return undefined if it is absent.
     */
    getOrUndefined(): T | undefined {
        return this.value;
    }

    isPresent(): boolean {
        return this.value !== undefined && this.value !== null;
    }

    static of<T>(value: T, name?: string): Optional<T> {
        return new Optional<T>(value, name);
    }

    static empty<T>(): Optional<T> {
        return new Optional<T>(undefined);
    }

    /**
     * Return true if the given object is present.
     *
     */
    static present(obj?: any) {
        return obj !== undefined && obj !== null;
    }

}

/**
 * Just consume a value with no need to return any result.
 */
export interface ConsumeFunction<T> {
    (value: T): void;
}

export interface MapFunction<T> {
    (value: T): any;
}

export interface FilterFunction<T> {
    (value?: T): T;
}
