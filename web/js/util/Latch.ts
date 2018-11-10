import {ResolvablePromise} from "./ResolvablePromise";

/**
 * A latch that can be resolved. Like a ResolveablePromise by
 */
export class Latch<T> {

    private promise: Promise<T>;

    // noinspection TsLint
    private _resolve: (value?: T) => void = () => { };

    // noinspection TsLint
    private _reject: (reason?: any) => void = () => { };

    constructor() {

        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

    }

    // noinspection TsLint
    public resolve(value: T) {
        this._resolve(value);
    }

    // noinspection TsLint
    public reject(reason: any) {
        this._reject(reason);
    }

    // noinspection TsLint
    public async get(): Promise<T> {
        return this.promise;
    }

}
