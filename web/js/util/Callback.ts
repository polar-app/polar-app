import {NULL_FUNCTION} from './Functions';

export class Callback {

    private target: () => void = NULL_FUNCTION;

    public set(target: () => void) {
        this.target = target;
    }

    public call() {
        this.target();
    }

}

export interface Callable {
    call(): void;
}

export interface Writable {

}


/**
 * Simple mechanism that allows callers to write functions together without
 * passing refs around.
 */
export class Callbacks {

    public static create(): [CallbackFunction, SetCallbackFunction] {

        let target: CallbackFunction = NULL_FUNCTION;

        const setCallback: SetCallbackFunction = (actual: () => void): void => {
            target = actual;
        };

        const callback = (): void => {
            target();
        };

        return [callback, setCallback];

    }

}

export type CallbackFunction = () => void;

export type SetCallbackFunction = (actual: () => void) => void;
