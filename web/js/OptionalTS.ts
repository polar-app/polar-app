// simple optional implementation so we don't need to resort to jquery

export class OptionalTS<T> {

    private readonly value?: T = undefined;

    constructor(value?: T) {
        this.value = value;
    }

    map(mapFunction: MapFunction<T>): OptionalTS<T> {

        if (this.value !== undefined) {
            return new OptionalTS(mapFunction(this.value));
        }

        return new OptionalTS();

    };

    filter(filterFunction: FilterFunction<T>): OptionalTS<T> {

        if (this.value !== undefined && filterFunction(this.value)) {
            return new OptionalTS(this.value);
        }

        return new OptionalTS();

    }

    getOrElse(value: T): T {
        if (this.value !== undefined) {
            return this.value;
        }

        return value;
    };

    static of<T>(value: T): OptionalTS<T> {
        return new OptionalTS<T>(value);
    };

}

export interface MapFunction<T> {
    (value: T): T;
}

export interface FilterFunction<T> {
    (value?: T): T;
}
