import * as React from "react";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";

export function isInputCompleteEvent(event: React.KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
}

interface InputCompleteListenerOpts {
    readonly onComplete: () => void;
    readonly onCancel?: Callback;
    readonly stopPropagation?: boolean;
}

interface InputCompleteListeners {
    readonly onKeyPress: (event: React.KeyboardEvent) => void;
    readonly onKeyUp: (event: React.KeyboardEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

// TODO: this code doesn't work reliably at blocking key bindings and I'm not
// sure why.  It DOES seem to prevent the propagation and catches it and it
// might be because we're using global key bindings BUT the main issue here is
// that it seems to work half the time.
//
//
// - solutions include

export function useInputCompleteListener(opts: InputCompleteListenerOpts): InputCompleteListeners {

    const stopPropagationHandler = React.useCallback((event: React.KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            event.preventDefault();
            event.stopPropagation();
            opts.onComplete();
            return;
        }

        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
            return;
        }

        if (opts.stopPropagation) {
            stopPropagationHandler(event);
        }

    }, []);

    if (opts.stopPropagation) {
        return {
            onKeyDown,
            onKeyPress: stopPropagationHandler,
            onKeyUp: stopPropagationHandler
        }
    }

    return {
        onKeyDown,
        onKeyPress: NULL_FUNCTION,
        onKeyUp: NULL_FUNCTION
    };

}

interface IProps {

    readonly onComplete: Callback;
    readonly onCancel?: Callback;

    /**
     * When try we prevent events from propagating.
     */
    readonly stopPropagation?: boolean;

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
