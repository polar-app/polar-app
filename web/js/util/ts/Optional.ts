

export class Optional<T> {

    constructor(value: T | undefined | null, name?: string) {
        this.value = value;
        this.name = name;
    }

    /**
     * An name for this Optional which can be used when generating errors.
     */
    public readonly name?: string = undefined;

    private readonly value: T | null | undefined = undefined;

    public map<V>(mapFunction: MapFunction<NonNullable<T>, V>): Optional<V> {

        if (this.isPresent()) {
            return new Optional(mapFunction(this.value!), this.name);
        }

        return new Optional<V>(undefined, this.name);

    }

    public when(consumeFunction: ConsumeFunction<NonNullable<T>>) {

        if (this.isPresent()) {
            consumeFunction(this.value!);
        }

    }

    public filter(filterFunction: FilterFunction<NonNullable<T>>): Optional<T> {

        if (this.isPresent() && filterFunction(this.value!)) {
            return new Optional(this.value);
        }

        return new Optional<T>(undefined, this.name);

    }

    public get(): NonNullable<T> {

        if (this.isPresent()) {
            return this.value!;
        } else {
            throw new Error("The value is undefined");
        }

    }

    public getOrElse(value: NonNullable<T>): NonNullable<T> {

        if (this.isPresent()) {
            return this.value!;
        }

        return value;
    }

    /**
     * Get the value or return undefined if it is absent.
     */
    public getOrUndefined(): T | undefined {

        if (this.value === null) {
            return undefined;
        }

        return this.value;
    }

    public isPresent(): boolean {
        return this.value !== undefined && this.value !== null;
    }

    public static of<T>(value: T | null | undefined, name?: string): Optional<T> {
        return new Optional<T>(value, name);
    }

    public static empty<T>(): Optional<T> {
        return new Optional<T>(undefined);
    }

    /**
     * Return true if the given object is present.
     *
     */
    public static present(obj?: any) {
        return obj !== undefined && obj !== null;
    }

}

/**
 * Just consume a value with no need to return any result.
 */
export type ConsumeFunction<T> = (value: T) => void;

export type MapFunction<T, V> = (value: T) => V;

export type FilterFunction<T> = (value: T) => boolean;
