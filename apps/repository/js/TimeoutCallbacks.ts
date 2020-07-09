export namespace TimeoutCallbacks {

    export type TimeoutCallback<V> = (value: V) => void;

    export function executedWithTimeout<V>(delegate: TimeoutCallback<V>): TimeoutCallback<V> {

        // for some reason when I try to autotag the input is automatically
        // filled with a 't'.  react-hotkeys isn supposed to stop propagation
        // by default but that seems to not be functional.
        return (value: V) => {
            setTimeout(() => delegate(value), 1);
        };

    }

    export type CallbacksMap<V> = {[name: string]: TimeoutCallback<V>};

    export function callbacksWithTimeout<V>(callbacks: CallbacksMap<V>) {
        const result = {...callbacks};

        for (const key of Object.keys(result)) {
            result[key] = executedWithTimeout(result[key]);
        }

        return result;

    }

}
