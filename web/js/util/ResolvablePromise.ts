export class ResolvablePromise<T> implements Promise<T> {

    private promise: Promise<T>;

    public resolve: (value?: T) => void = () => {};

    readonly [Symbol.toStringTag]: "Promise";

    constructor() {
        this.promise = new Promise<T>(resolve => {
            this.resolve = resolve;
        });
    }

    public async get(): Promise<T> {
        return this.promise;
    }

    public set(value: T) {
        this.resolve(value);
    }

    public catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): Promise<T | TResult> {
        return this.promise.then(onrejected);
    }

    public then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled);
    }

}
