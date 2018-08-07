/**
 * A Nullable type that can be mutates / set.  There are still patterns where
 * null types may be valuable without constantly checking them.
 */
export class Nullable<T> {

    private value?: T = undefined;

    get(): T {

        if(this.value === undefined || this.value == null) {
            throw new Error("Value is undefined");
        }

        return this.value;

    }

    getOrElse(value: T): T {

        if (this.value !== undefined && this.value !== null) {
            return this.value;
        }

        return value;

    }

    isPresent(): boolean {
        return this.value !== undefined && this.value !== null;
    }

    set(value: T): void {
        this.value = value;
    }

}
