export class Promises {

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout
     */
    static async waitFor(timeout: number) {

        return new Promise(resolve => {

            setTimeout(() => {
                resolve();
            }, timeout);

        });

    }

    /**
     * Return a promise that returns a literal value.
     *
     * @param val
     * @return {Promise<any>}
     */
    static of(val: any) {
        return new Promise(resolve => {
            resolve(val);
        });
    }


    /**
     * Calls the given callback as a promise which we can await but runs it with
     * a background thread via timeout.
     */
    static async withTimeout<T>(timeout: number, callback: () => Promise<T> ) {

        return new Promise((resolve,reject) => {

            setTimeout(() => {
                callback().then(result => resolve(result))
                          .catch(err => reject(err));
            }, timeout);

        });

    }

}

export interface Completion<T> {

    readonly resolve: ResolveFunction<T>;
    readonly reject: RejectFunction;

}

export interface ResolveFunction<T> {
    (value: T): void
}

export interface RejectFunction {
    (error: Error): void
}
