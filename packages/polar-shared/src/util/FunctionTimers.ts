/**
 * Time the duration of a function.
 */
export namespace FunctionTimers {

    export type DurationMS = number;

    export type ExecTuple<T> = Readonly<[T, DurationMS]>;

    export function exec<T>(func: () => T): ExecTuple<T> {
        const before = Date.now();
        const result = func();
        const after = Date.now();
        const duration = after - before;
        return [result, duration];
    }

    export async function execAsync<T>(func: () => Promise<T>): Promise<ExecTuple<T>> {
        const before = Date.now();
        const result = await func();
        const after = Date.now();
        const duration = after - before;
        return [result, duration];
    }

}
