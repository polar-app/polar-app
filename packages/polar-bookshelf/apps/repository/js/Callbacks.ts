export namespace Callbacks {

    export function executedWithTimeout(delegate: () => void): () => void {

        // for some reason when I try to autotag the input is automatically
        // filled with a 't'.  react-hotkeys isn supposed to stop propagation
        // by default but that seems to not be functional.
        return () => {
            setTimeout(delegate, 1);
        };

    }

    export type CallbacksMap = {[name: string]: () => void};

    export function callbacksWithTimeout(callbacks: CallbacksMap) {
        const result = {...callbacks};

        for (const key of Object.keys(result)) {
            result[key] = executedWithTimeout(result[key]);
        }

        return result;

    }

}
