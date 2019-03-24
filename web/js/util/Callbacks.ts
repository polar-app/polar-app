import {NULL_FUNCTION} from './Functions';

/**
 * Simple mechanism that allows callers to write functions together without
 * passing refs around.  The setCallback function can be passed to one component
 * and the callback function can be passed to another and one is for executing
 * and the other is for updating.  This way the writer can never execute and
 * the executor can never write.
 *
 * This is null save so that if you call it BEFORE it's setup nothing happens
 * which is fine for UI components which aren't shown until they are ready since
 * by that time they will be wired together properly.
 *
 * This also doesn't need any type of GC or reference counting to unwire them
 * because since no object are updated they are just all GCd together and the
 * wiring goes away.
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
