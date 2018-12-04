/**
 * A Provider is just a function that returns a given type.
 */
export type Provider<T> = () => T;

/**
 * A provider that can be used as an interface.
 */
export interface IProvider<T> {
    get(): T;
}

export class Providers {

    /**
     * Convert a provider interface to a function.
     */
    public static toFunction<T>(provider: IProvider<T>) {
        return () => provider.get();
    }

    /**
     * Return a provider using the given value.
     */
    public static of<T>(value: T): Provider<T> {
        return () => value;
    }

    /**
     * Memoize the given function to improve its performance or make it optional.
     */
    public static memoize<T>(provider: Provider<T>): Provider<T> {

        let memoized: boolean = false;

        // an error that the provider threw
        let err: Error | undefined;

        // the value that the provider returned.
        let memo: T | undefined;

        return () => {

            if (memoized) {

                if (err) {
                    throw err;
                }

                return memo!;

            }

            try {

                memo = provider();
                return memo!;

            } catch (e) {
                err = e;
                throw e;
            } finally {
                memoized = true;
            }

        };

    }

}

export type AsyncProvider<T> = () => Promise<T>;

export class AsyncProviders {

    public static of<T>(value: T): AsyncProvider<T> {
        return () => Promise.resolve(value);
    }

    /**
     */
    public static memoize<T>(provider: AsyncProvider<T>): AsyncProvider<T> {

        let memoized: boolean = false;

        // an error that the provider threw
        let err: Error | undefined;

        // the value that the provider returned.
        let memo: T | undefined;

        return async () => {

            if (memoized) {

                if (err) {
                    throw err;
                }

                return memo!;

            }

            try {

                memo = await provider();
                return memo!;

            } catch (e) {
                err = e;
                throw e;
            } finally {
                memoized = true;
            }

        };

    }
}
