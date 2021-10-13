import {Callback, Callback1} from "./Functions";

export type DebouncerCallback = Callback;

/**
 * A task scheduler that only executes a task once every interval and replaces
 * the task that it should execute so that the most recent task is the one that
 * is executed (replacing stale tasks)
 */
export namespace Debouncers {

    export interface DebouncerOpts {
        readonly interval: number;
    }

    export function create(callback: Callback,
                           opts: DebouncerOpts = {interval: 100}): DebouncerCallback {

        // eslint-disable-next-line @typescript-eslint/ban-types
        let timeout: object | number | undefined;

        return () => {

            if (timeout) {
                // already scheduled
                return;
            }

            timeout = setTimeout(() => {
                callback();
                // now clear the timeout so we can schedule again
                timeout = undefined;
            }, opts.interval);

        };

    }

    /**
     * Create a debouncer with one argument.
     */
    export function create1<T>(callback: Callback1<T>,
                               opts: DebouncerOpts = {interval: 100}): Callback1<T> {

        // eslint-disable-next-line @typescript-eslint/ban-types
        let timeout: object | number | undefined;

        return (value) => {

            if (timeout) {
                // already scheduled
                return;
            }

            timeout = setTimeout(() => {
                callback(value);
                // now clear the timeout so we can schedule again
                timeout = undefined;
            }, opts.interval);

        };

    }

    export type InlineDebouncer = () => boolean;

    /**
     * Creates an inline debouncer that is just returns true if we should
     * execute. Note that if you're expected to execute you MUST execute because
     * the inline debouncer itself doesn't keep track of your execution.
     *
     * This is more convenient sometimes when working with async functions
     * or something that needs to be flushed, cancelled, etc.
     */
    export function inline(timeout = 500): InlineDebouncer {

        let executed: number | undefined;

        return (): boolean => {

            const now = Date.now();

            if (executed === undefined || now - executed > timeout) {
                executed = now;
                return true;
            }

            return false;

        }

    }

}



