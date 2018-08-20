import {Preconditions} from '../Preconditions';
import {Optional} from './ts/Optional';

export class Functions {

    /**
     * Take a function and make it an external script we can pass to an external
     * javascript interpreter. This can be used with the electron renderer, chrome
     * headless, etc.
     *
     * @param _function
     * @param _opts
     * @return {string}
     */
    static functionToScript(_function: Function, ... _opts: any[]) {

        let result = "";
        result += _function.toString();
        result += "\n";

        // TODO: expand _opts to varargs... not just one opts.  This way the
        // function can be an ordinary function.
        if(_opts) {
            result += `${_function.name}(${JSON.stringify(_opts)});`;
        } else {
            result += `${_function.name}();`;
        }
        return result;

    }

    /**
     * We iterate over all keys in the dictionary.  Even inherited keys.
     *
     * @param dict
     * @param callback
     */
    static forDict(dict: {[key: string]: any}, callback: KeyValueCallback) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        // get the keys first, that way we can mutate the dictionary while iterating
        // through it if necessary.
        let keys = Object.keys(dict);

        keys.forEach( (key: string) => {
            let value = dict[key];
            callback(key,value);
        })

    };


    /**
     * We iterate over all keys in the dictionary.
     *
     * @param dict
     * @param callback
     */
    static async forOwnKeys(dict: {[key: string]: any}, callback: KeyValueCallback) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        for(let key in dict) {

            if(dict.hasOwnProperty(key)) {
                let value = dict[key];
                await callback(key,value);
            }

        }

    };

    /**
     * Calls the given callback as a promise which we can await.
     */
    static async withTimeout(timeout: number, callback: () => any) {

        return new Promise((resolve,reject) => {

            setTimeout(() => {
                callback().then((result: any) => resolve(result))
                          .catch((err: Error) => reject(err));
            }, timeout);

        });

    }

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout {number}
     * @return {Promise<void>}
     */
    static async waitFor(timeout: number) {

        return new Promise(resolve => {

            setTimeout(() => {
                resolve();
            }, timeout);

        });

    }

    /**
     *
     * @Deprecated use createSiblings as createSiblingTuples implies that this
     * is a tuple and it's actually a triple.
     */
    static createSiblingTuples(arrayLikeObject: any) {
        return Functions.createSiblings(arrayLikeObject);
    }

    /**
     * Go over the array-like object and return tuples with prev, curr, and next
     * properties so that we can peek at siblings easily.  If the prev and / or
     * next are not present these values are null.
     *
     * This can be used for algorithms that need to peek ahead or behind
     * inside an iterative algorithm
     *
     * @param arrayLikeObject {Array<any>}
     * @return {Array<ArrayPosition>}
     */
    static createSiblings(arrayLikeObject: any) {

        Preconditions.assertNotNull(arrayLikeObject, "arrayLikeObject");

        let result: IArrayPosition<any>[] = [];

        for(let idx = 0; idx < arrayLikeObject.length; ++idx) {

            result.push({
                curr: arrayLikeObject[idx],
                prev: Optional.of(arrayLikeObject[idx-1]).getOrElse(null),
                next: Optional.of(arrayLikeObject[idx+1]).getOrElse(null)
            });

        }

        return result;

    };

}

/**
 * Represents a 'position' object for createSiblings() that has a curr (current),
 * prev (previous), and next references for working with lists of objects.  The
 * position allow sus to know where we currently are but also the previous and
 * future states.
 */
export interface IArrayPosition<T> {

    readonly prev?: T

    readonly curr: T;

    readonly next?: T;

}

export interface KeyValueCallback {
    (key: string, value: any): void;
}

export function forDict(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forDict(dict, callback);
}

export function forOwnKeys(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forOwnKeys(dict, callback);
}

export function createSiblingTuples(arrayLikeObject: any) {
    return Functions.createSiblingTuples(arrayLikeObject);
}

export function createSiblings(arrayLikeObject: any) {
    return Functions.createSiblings(arrayLikeObject);
}


