import {Logger} from '../logger/Logger';

const log = Logger.create();

export class Promises {

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout
     */
    public static async waitFor(timeout: number) {

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
    public static of(val: any) {
        return new Promise(resolve => {
            resolve(val);
        });
    }


    /**
     * Calls the given callback as a promise which we can await but runs it with
     * the background event loop via timeout to avoid locking up the UI with longer
     * running tasks.
     */
    public static async withTimeout<T>(timeout: number, callback: () => Promise<T> ) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                callback().then(result => resolve(result))
                          .catch(err => reject(err));
            }, timeout);

        });

    }

    /**
     * Execute a function which is async and log any errors it generates.
     *
     * This is helpful if we don't care about the result but do want to know
     * if it has failed.
     *
     * @param func
     */
    public static executeLogged(func: () => Promise<any>) {
        func().catch(err => log.error("Caught error: ", err))
    }

}

export interface Completion<T> {

    readonly resolve: ResolveFunction<T>;
    readonly reject: RejectFunction;

}

export interface ResolveFunction<T> {
    (value: T): void;
}

export interface RejectFunction {
    (error: Error): void;
}
