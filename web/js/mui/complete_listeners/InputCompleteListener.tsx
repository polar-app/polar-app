import * as React from "react";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";

export function isInputCompleteEvent(event: React.KeyboardEvent) {
    return event.key === 'Enter';
}

interface InputCompleteListenerOpts {
    readonly onComplete: () => void;
    readonly onCancel?: Callback;
}

interface InputCompleteListeners {
    readonly onKeyPress: (event: React.KeyboardEvent) => void;
    readonly onKeyUp: (event: React.KeyboardEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

export function useInputCompleteListener(opts: InputCompleteListenerOpts): InputCompleteListeners {

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            opts.onComplete();
            return;
        }

        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
            return;
        }

    }, []);

    return {
        onKeyDown,
        onKeyPress: NULL_FUNCTION,
        onKeyUp: NULL_FUNCTION
    };

}

interface IProps {

    readonly onComplete: Callback;
    readonly onCancel?: Callback;

    readonly children: JSX.Element;

}

export const InputCompleteListener = deepMemo((props: IProps) => {

    const handlers = useInputCompleteListener(props);

    return (
        <div {...handlers} className="input-complete-listener">
            {props.children}
        </div>
    );

});
